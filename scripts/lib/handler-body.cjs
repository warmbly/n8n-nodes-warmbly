/**
 * Pure readers for one gin handler: how its JSON body is bound, and how a route
 * registration that spans several lines is joined. Kept as CommonJS so the unit
 * tests can load it without an ESM loader.
 */
'use strict';

/** The struct a handler binds the JSON body to, if any. */
function boundBody(body) {
	const bind = /(?:ShouldBindJSON|BindJSON|ShouldBindWith|ShouldBind)\(&(\w+)\)/.exec(body);
	if (!bind) {
		// A handler that reads the body itself takes whatever JSON the caller
		// sends (the agent-tool call passes the tool's argument object straight
		// through), so there are no named fields to expose.
		return /io\.ReadAll\(c\.Request\.Body\)/.test(body) ? { kind: 'raw' } : null;
	}
	return resolveVariable(body, bind[1], new Set());
}

function resolveVariable(body, variable, seen) {
	if (seen.has(variable)) return { kind: 'unknown' };
	seen.add(variable);

	// A handler that accepts several shapes binds to json.RawMessage and then
	// unmarshals it into the type it documents. Follow the last plain variable
	// it unmarshals into (the fallback shape wins over a field of it).
	if (new RegExp(`var ${variable} json\\.RawMessage`).test(body)) {
		const targets = [
			...body.matchAll(new RegExp(`json\\.Unmarshal\\(${variable},\\s*&(\\w+)\\)`, 'g')),
		].map((m) => m[1]);
		const last = targets[targets.length - 1];
		return last ? resolveVariable(body, last, seen) : { kind: 'unknown' };
	}

	const typed = new RegExp(`var ${variable} ((?:\\w+\\.)?\\w+)\\s*$`, 'm').exec(body);
	if (typed) return { kind: 'named', type: typed[1] };

	// `req := models.Thing{}` or one seeded with defaults, `req := models.Thing{Field: ...}`.
	const literal = new RegExp(`${variable}\\s*:?=\\s*&?((?:\\w+\\.)?\\w+)\\{`, 'm').exec(body);
	if (literal) return { kind: 'named', type: literal[1] };

	const anon = new RegExp(`var ${variable} struct \\{([\\s\\S]*?)\\n\\t\\}`, 'm').exec(body);
	if (anon) return { kind: 'anonymous', fields: parseAnonFields(anon[1]) };

	const sliceOf = new RegExp(`var ${variable} \\[\\]((?:\\w+\\.)?\\w+)`, 'm').exec(body);
	if (sliceOf) return { kind: 'array', type: sliceOf[1] };

	return { kind: 'unknown' };
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

/**
 * The text of a route registration starting at `lines[start]`, joined across
 * continuation lines until its parentheses balance, so middleware or a handler
 * on the next line still counts.
 */
function routeCall(lines, start) {
	let text = lines[start];
	let depth = 0;
	for (let i = start; i < lines.length; i++) {
		if (i > start) text += '\n' + lines[i];
		for (const ch of lines[i].replace(/"[^"]*"/g, '')) {
			if (ch === '(') depth++;
			else if (ch === ')') depth--;
		}
		if (depth <= 0) break;
	}
	return text;
}

module.exports = { boundBody, parseAnonFields, routeCall };
