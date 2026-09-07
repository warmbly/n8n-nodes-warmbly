/**
 * Minimal Go source readers for the Warmbly backend.
 *
 * These are deliberately syntactic (regex over source text, no type checking):
 * the backend follows a very regular shape — gin route tables, `func (h
 * *Handler) Name(c *gin.Context)` handlers, and request structs with json tags —
 * so a parser that understands only that shape stays short and predictable.
 * Anything it cannot resolve is reported, never guessed.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/** Every .go file under `dir`, recursively, excluding tests. */
export function goFiles(dir, { includeTests = false } = {}) {
	const out = [];
	const walk = (d) => {
		for (const entry of readdirSync(d)) {
			const p = join(d, entry);
			if (statSync(p).isDirectory()) {
				walk(p);
				continue;
			}
			if (!entry.endsWith('.go')) continue;
			if (!includeTests && entry.endsWith('_test.go')) continue;
			out.push(p);
		}
	};
	walk(dir);
	return out;
}

/** The `//` comment block immediately above `lineIndex` (0-based), as prose. */
export function docAbove(lines, lineIndex) {
	const collected = [];
	for (let i = lineIndex - 1; i >= 0; i--) {
		const line = lines[i].trim();
		if (line.startsWith('//')) {
			collected.unshift(line.replace(/^\/\/\s?/, ''));
			continue;
		}
		break;
	}
	return collected.join(' ').trim();
}

/**
 * Index every `func (h *Handler) Name(c *gin.Context …)` in a package
 * directory, including the one-line forms that delegate to a shared helper
 * (`func (h *Handler) StartWarmup(c *gin.Context) { h.warmupLifecycle(c, "start") }`).
 * Returns name -> { file, doc, body }.
 */
export function indexHandlers(dirs) {
	const handlers = new Map();
	for (const dir of dirs) {
		for (const file of goFiles(dir)) {
			const src = readFileSync(file, 'utf8');
			const lines = src.split('\n');
			const re = /^func \(h \*Handler\) (\w+)\(c \*gin\.Context[^)]*\)[^{]*\{(.*)$/;
			for (let i = 0; i < lines.length; i++) {
				const m = re.exec(lines[i]);
				if (!m) continue;
				const oneLiner = m[2].trim().endsWith('}');
				handlers.set(m[1], {
					file,
					doc: docAbove(lines, i),
					body: oneLiner ? lines[i] : bodyFrom(lines, i),
				});
			}
		}
	}
	return handlers;
}

/** The brace-balanced body of the function whose header sits at `start`. */
function bodyFrom(lines, start) {
	const out = [];
	let depth = 0;
	for (let i = start; i < lines.length; i++) {
		const line = lines[i];
		out.push(line);
		for (const ch of stripStringsAndComments(line)) {
			if (ch === '{') depth++;
			else if (ch === '}') depth--;
		}
		if (i > start && depth <= 0) break;
	}
	return out.join('\n');
}

/** Blank out string literals and line comments so brace counting stays honest. */
function stripStringsAndComments(line) {
	let out = '';
	let inString = false;
	let quote = '';
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (inString) {
			if (ch === '\\') {
				i++;
				continue;
			}
			if (ch === quote) inString = false;
			continue;
		}
		if (ch === '"' || ch === '`' || ch === "'") {
			inString = true;
			quote = ch;
			continue;
		}
		if (ch === '/' && line[i + 1] === '/') break;
		out += ch;
	}
	return out;
}

/**
 * Index every named struct in the given directories: name -> field list.
 * Fields carry their json name, Go type, whether binding marks them required,
 * and the doc comment above (or trailing comment beside) the field.
 */
export function indexStructs(dirs) {
	const structs = new Map();
	for (const dir of dirs) {
		for (const file of goFiles(dir)) {
			const lines = readFileSync(file, 'utf8').split('\n');
			for (let i = 0; i < lines.length; i++) {
				const m = /^type (\w+) struct \{$/.exec(lines[i]);
				if (!m) continue;
				const name = m[1];
				const fields = [];
				let j = i + 1;
				for (; j < lines.length && !/^\}/.test(lines[j]); j++) {
					// A field whose type is an inline struct spans several lines
					// and carries its json tag on the closing brace. It is one
					// object-valued field, not a run of top-level ones.
					const nested = /^\t(\w+)\s+\*?(?:\[\])?struct \{$/.exec(lines[j]);
					if (nested) {
						const close = findNestedClose(lines, j);
						const tag = /`([^`]*)`/.exec(lines[close] ?? '');
						const json = tag ? /json:"([^"]*)"/.exec(tag[1]) : null;
						if (json) {
							const [jsonName, ...opts] = json[1].split(',');
							if (jsonName && jsonName !== '-') {
								fields.push({
									goName: nested[1],
									goType: lines[j].includes('[]struct')
										? '[]struct'
										: 'struct',
									name: jsonName,
									omitempty: opts.includes('omitempty'),
									required: false,
									binding: '',
									description: docAbove(lines, j),
								});
							}
						}
						j = close;
						continue;
					}
					const field = parseStructField(lines, j);
					if (field) fields.push(field);
				}
				// A later package can redeclare a name; first definition wins and
				// the collision is visible to the caller.
				if (!structs.has(name)) {
					structs.set(name, { name, file, fields, pkg: pkgOf(file) });
				}
			}
		}
	}
	return structs;
}

function pkgOf(file) {
	const parts = file.split('/');
	return parts[parts.length - 2];
}

/** The line closing the inline struct opened at `open`. */
function findNestedClose(lines, open) {
	let depth = 0;
	for (let i = open; i < lines.length; i++) {
		depth += (stripStringsAndComments(lines[i]).match(/\{/g) || []).length;
		depth -= (stripStringsAndComments(lines[i]).match(/\}/g) || []).length;
		if (i > open && depth <= 0) return i;
	}
	return open;
}

// The type is everything between the field name and its tag: `[]string`,
// `map[string]any`, `*models.Thing`, `json.RawMessage`.
const FIELD_RE = /^\t(\w+)\s+([^\s`][^`]*?)\s+`([^`]*)`(?:\s*\/\/\s?(.*))?$/;
const EMBED_RE = /^\t([A-Z][\w]*(?:\.\w+)?)(?:\s+`([^`]*)`)?\s*$/;

function parseStructField(lines, i) {
	const line = lines[i];
	const m = FIELD_RE.exec(line);
	if (m) {
		const [, goName, goType, tag, trailing] = m;
		// Query structs bound with ShouldBindQuery name their parameters with a
		// `form` tag and often carry no json tag at all.
		const json = /json:"([^"]*)"/.exec(tag) ?? /form:"([^"]*)"/.exec(tag);
		if (!json) return null;
		const [jsonName, ...tagOpts] = json[1].split(',');
		if (jsonName === '-' || jsonName === '') return null;
		const binding = /binding:"([^"]*)"/.exec(tag);
		return {
			goName,
			goType,
			name: jsonName,
			omitempty: tagOpts.includes('omitempty'),
			required: !!binding && binding[1].split(',').includes('required'),
			binding: binding ? binding[1] : '',
			description: (trailing || docAbove(lines, i) || '').trim(),
		};
	}
	const e = EMBED_RE.exec(line);
	if (e) {
		// An embedded type carrying a json tag is a named object field, not a
		// promotion of the embedded type's own fields.
		const json = e[2] ? /json:"([^"]*)"/.exec(e[2]) : null;
		if (json) {
			const [jsonName, ...opts] = json[1].split(',');
			if (!jsonName || jsonName === '-') return null;
			return {
				goName: e[1],
				goType: e[1],
				name: jsonName,
				omitempty: opts.includes('omitempty'),
				required: false,
				binding: '',
				description: docAbove(lines, i),
			};
		}
		return { embed: e[1] };
	}
	return null;
}

/**
 * The Handler's service fields: `CampaignService campaign.CampaignService`
 * becomes `CampaignService -> { pkg: 'campaign', type: 'CampaignService' }`.
 * A handler reaches its data through these, so they are the first hop when
 * asking what an operation actually returns.
 */
export function indexHandlerServices(handlerDir) {
	const fields = new Map();
	for (const file of goFiles(handlerDir)) {
		const lines = readFileSync(file, 'utf8').split('\n');
		const start = lines.findIndex((l) => /^type Handler struct \{$/.test(l));
		if (start < 0) continue;
		for (let i = start + 1; i < lines.length && !/^\}/.test(lines[i]); i++) {
			const m = /^\t(\w+)\s+\*?(\w+)\.(\w+)\s*$/.exec(lines[i]);
			if (m) fields.set(m[1], { pkg: m[2], type: m[3] });
		}
	}
	return fields;
}

/**
 * Every interface method in the app packages, keyed `pkg.Interface.Method`,
 * with the type it returns first. Enough to answer "does this operation hand
 * back a list envelope?" without a type checker.
 */
export function indexInterfaceMethods(appDir) {
	const methods = new Map();
	for (const file of goFiles(appDir)) {
		const lines = readFileSync(file, 'utf8').split('\n');
		const pkg = pkgOf(file);
		let current = null;
		for (let i = 0; i < lines.length; i++) {
			const open = /^type (\w+) interface \{$/.exec(lines[i]);
			if (open) {
				current = open[1];
				continue;
			}
			if (current && /^\}/.test(lines[i])) {
				current = null;
				continue;
			}
			if (!current) continue;
			const head = /^\t(\w+)\(/.exec(lines[i]);
			if (!head) continue;
			// A signature may wrap over several lines; join it back up before
			// reading off the first return type.
			let decl = lines[i].trim();
			let depth = balance(decl);
			for (let j = i + 1; depth > 0 && j < lines.length; j++) {
				decl += ' ' + lines[j].trim();
				depth += balance(lines[j]);
				i = j;
			}
			const ret = /\)\s*\(?\s*([^,()]+)/.exec(decl.slice(decl.indexOf('(')));
			if (ret) methods.set(`${pkg}.${current}.${head[1]}`, ret[1].trim());
		}
	}
	return methods;
}

/** Net parenthesis depth a line contributes, ignoring strings and comments. */
function balance(line) {
	const bare = stripStringsAndComments(line);
	return (bare.match(/\(/g) || []).length - (bare.match(/\)/g) || []).length;
}

/**
 * String enums: `type SuppressionKind string` plus a const block naming its
 * values. Gives a parameter a real dropdown instead of a free-text box.
 */
export function indexEnums(dirs) {
	const enums = new Map();
	for (const dir of dirs) {
		for (const file of goFiles(dir)) {
			const src = readFileSync(file, 'utf8');
			const stringTypes = new Set(
				[...src.matchAll(/^type (\w+) string$/gm)].map((m) => m[1]),
			);
			if (stringTypes.size === 0) continue;
			for (const m of src.matchAll(/^\t\w+\s+(\w+)\s*=\s*"([^"]*)"$/gm)) {
				const [, type, value] = m;
				if (!stringTypes.has(type)) continue;
				if (!enums.has(type)) enums.set(type, []);
				const values = enums.get(type);
				if (!values.includes(value)) values.push(value);
			}
		}
	}
	return enums;
}

/** Resolve embedded structs so a caller sees one flat field list. */
export function flattenStruct(structs, name, seen = new Set()) {
	const decl = structs.get(stripPkg(name));
	if (!decl || seen.has(decl.name)) return [];
	seen.add(decl.name);
	const out = [];
	for (const field of decl.fields) {
		if (field.embed) {
			out.push(...flattenStruct(structs, field.embed, seen));
			continue;
		}
		out.push(field);
	}
	return out;
}

export function stripPkg(name) {
	return name.replace(/^\*/, '').replace(/^\w+\./, '');
}
