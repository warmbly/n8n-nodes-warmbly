/**
 * The extractor reads each handler's Go source to find the struct its JSON body
 * binds to. These pin the patterns it has to recognise.
 */
import { execFileSync } from 'child_process';
import { join } from 'path';

const bindingModule = join(__dirname, '../../scripts/lib/body-binding.mjs');
const goSource = join(__dirname, '../../scripts/lib/go-source.mjs');

function bind(body: string): unknown {
	const out = execFileSync(
		process.execPath,
		[
			'--input-type=module',
			'-e',
			`import { boundBody } from ${JSON.stringify('file://' + bindingModule)};
			console.log(JSON.stringify(boundBody(${JSON.stringify(body)})));`,
		],
		{ encoding: 'utf8' },
	);
	return JSON.parse(out);
}

describe('boundBody', () => {
	it('follows ShouldBindJSON into a declared struct', () => {
		expect(bind('\tvar in models.Thing\n\tif err := c.ShouldBindJSON(&in); err != nil {\n')).toEqual({
			kind: 'named',
			type: 'models.Thing',
		});
	});

	it('follows GetRawData then json.Unmarshal into the struct', () => {
		const body = [
			'\traw, err := c.GetRawData()',
			'\tif err != nil {',
			'\t\treturn',
			'\t}',
			'\tvar in apollo.SourceInput',
			'\tif err := json.Unmarshal(raw, &in); err != nil {',
			'\t\treturn',
			'\t}',
			'\tvar probe map[string]json.RawMessage',
			'\tif json.Unmarshal(raw, &probe) == nil {',
			'\t}',
			'',
		].join('\n');
		expect(bind(body)).toEqual({ kind: 'named', type: 'apollo.SourceInput' });
	});

	it('has no body for a handler that reads none', () => {
		expect(bind('\tid := c.Param("id")\n')).toBeNull();
	});
});

describe('flattenStruct', () => {
	it('keeps same-named structs from different packages apart', () => {
		const out = execFileSync(
			process.execPath,
			[
				'--input-type=module',
				'-e',
				`import { flattenStruct } from ${JSON.stringify('file://' + goSource)};
				const field = (name) => ({ name });
				const structs = new Map();
				const apollo = { name: 'SourceInput', pkg: 'apollo', fields: [field('list_id')] };
				const sf = { name: 'SourceInput', pkg: 'salesforce', fields: [field('object')] };
				structs.set('SourceInput', apollo);
				structs.set('apollo.SourceInput', apollo);
				structs.set('salesforce.SourceInput', sf);
				console.log(JSON.stringify(flattenStruct(structs, 'salesforce.SourceInput').map((f) => f.name)));`,
			],
			{ encoding: 'utf8' },
		);
		expect(JSON.parse(out)).toEqual(['object']);
	});
});
