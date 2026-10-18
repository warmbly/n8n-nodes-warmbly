/**
 * Which struct a handler binds its JSON request body to, read from the Go source.
 */
/** The struct a handler binds the JSON body to, if any. */
export function boundBody(body) {
	// `ShouldBindJSON(&in)`, or a handler that keeps the raw bytes (to see which
	// keys were sent) and then runs `json.Unmarshal(raw, &in)` into its struct.
	const bind =
		/(?:ShouldBindJSON|BindJSON|ShouldBindWith|ShouldBind)\(&(\w+)\)/.exec(body) ??
		/c\.GetRawData\(\)[\s\S]*?json\.Unmarshal\(\w+, &(\w+)\)/.exec(body);
	if (!bind) {
		// A handler that reads the body itself takes whatever JSON the caller
		// sends (the agent-tool call passes the tool's argument object straight
		// through), so there are no named fields to expose.
		return /io\.ReadAll\(c\.Request\.Body\)/.test(body) ? { kind: 'raw' } : null;
	}
	const variable = bind[1];

	const typed = new RegExp(`var ${variable} ((?:\\w+\\.)?\\w+)\\s*$`, 'm').exec(body);
	if (typed) return { kind: 'named', type: typed[1] };

	const literal = new RegExp(`${variable}\\s*:?=\\s*((?:\\w+\\.)?\\w+)\\{\\}`, 'm').exec(body);
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
