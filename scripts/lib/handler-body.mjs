import { flattenStruct } from './go-source.mjs';

/** The struct a handler binds the JSON body to, if any. */
export function boundBody(body, structs) {
	const bind = /(?:ShouldBindJSON|BindJSON|ShouldBindWith|ShouldBind)\(&(\w+)\)/.exec(body);
	if (!bind) {
		// A handler that reads the body itself takes whatever JSON the caller
		// sends (the agent-tool call passes the tool's argument object straight
		// through), so there are no named fields to expose.
		return /io\.ReadAll\(c\.Request\.Body\)/.test(body) ? { kind: 'raw' } : null;
	}
	const variable = bind[1];

	const typed = new RegExp(`var ${variable} ((?:\\w+\\.)?\\w+)\\s*$`, 'm').exec(body);
	if (typed?.[1] === 'json.RawMessage') return rawMessageBody(body, variable, structs) ?? { kind: 'raw' };
	if (typed) return { kind: 'named', type: typed[1] };

	// `req := models.Thing{}`, or one seeded with defaults: `req := models.Thing{Field: …}`.
	const literal = new RegExp(`${variable}\\s*:?=\\s*((?:\\w+\\.)?\\w+)\\{`, 'm').exec(body);
	if (literal) return { kind: 'named', type: literal[1] };

	const anon = new RegExp(`var ${variable} struct \\{([\\s\\S]*?)\\n\\t\\}`, 'm').exec(body);
	if (anon) return { kind: 'anonymous', fields: parseAnonFields(anon[1]) };

	const sliceOf = new RegExp(`var ${variable} \\[\\]((?:\\w+\\.)?\\w+)`, 'm').exec(body);
	if (sliceOf) return { kind: 'array', type: sliceOf[1] };

	return { kind: 'unknown' };
}

/**
 * A handler that binds the body to a `json.RawMessage` accepts more than one
 * shape (a bare list, or a selection object) and tries them in turn. The first
 * `json.Unmarshal` into a list is the published contract, so that is the body
 * the node exposes: `&data` with `var data []Item`, or `&sel.Field` where
 * `Field` is a list on `var sel Selection`.
 */
function rawMessageBody(body, variable, structs) {
	for (const m of body.matchAll(new RegExp(`json\\.Unmarshal\\(${variable},\\s*&(\\w+)(?:\\.(\\w+))?\\)`, 'g'))) {
		const [, target, member] = m;
		if (!member) {
			const list = new RegExp(`var ${target} \\[\\]((?:\\w+\\.)?\\w+)`, 'm').exec(body);
			if (list) return { kind: 'array', type: list[1] };
			continue;
		}
		const decl = new RegExp(`var ${target} ((?:\\w+\\.)?\\w+)\\s*$`, 'm').exec(body);
		const field = decl && flattenStruct(structs, decl[1]).find((f) => f.goName === member);
		const item = field && /^\[\](?:\*)?((?:\w+\.)?\w+)$/.exec(field.goType);
		if (item) return { kind: 'array', type: item[1] };
	}
	return null;
}

function parseAnonFields(block) {
	const fields = [];
	for (const line of block.split('\n')) {
		const m = /^\s*(\w+)\s+([\w\.\*\[\]]+)\s+`([^`]*)`(?:\s*\/\/\s?(.*))?/.exec(line);
		if (!m) continue;
		const [, goName, goType, tag, trailing] = m;
		const json = /json:"([^"]*)"/.exec(tag);
		if (!json) continue;
		const [name, ...opts] = json[1].split(',');
		if (!name || name === '-') continue;
		const binding = /binding:"([^"]*)"/.exec(tag);
		fields.push({
			goName,
			goType,
			name,
			omitempty: opts.includes('omitempty'),
			required: !!binding && binding[1].split(',').includes('required'),
			binding: binding ? binding[1] : '',
			description: (trailing || '').trim(),
		});
	}
	return fields;
}

/** Open minus close parentheses on a line of Go, ignoring those inside strings. */
export function parenDepth(text) {
	const code = text.replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/\/\/.*$/gm, '');
	return (code.match(/\(/g) ?? []).length - (code.match(/\)/g) ?? []).length;
}
