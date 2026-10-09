/**
 * The API extractor reads Warmbly's Go handlers. These pin the handler shapes
 * it has to understand, so a server refactor cannot silently change the node.
 * The extractor is an ES module, so each case runs in a child Node process.
 */
import { execFileSync } from 'child_process';
import { join } from 'path';

const LIB = join(__dirname, '..', '..', 'scripts', 'lib', 'handler-body.mjs');

function run(expression: string): unknown {
	const script = `
		import { boundBody, parenDepth } from ${JSON.stringify(LIB)};
		const structs = new Map([
			['Selection', { name: 'Selection', fields: [
				{ goName: 'Contacts', goType: '[]string', name: 'contacts' },
				{ goName: 'All', goType: 'bool', name: 'all' },
			] }],
		]);
		console.log(JSON.stringify(${expression}));
	`;
	return JSON.parse(
		execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }),
	);
}

const body = (go: string) => run(`boundBody(${JSON.stringify(go)}, structs)`);

describe('boundBody', () => {
	it('reads a typed var bound to the body', () => {
		expect(body('var req models.Thing\nc.ShouldBindJSON(&req)')).toEqual({
			kind: 'named',
			type: 'models.Thing',
		});
	});

	it('reads a literal seeded with defaults', () => {
		expect(
			body('req := models.Settings{Settings: models.Default()}\nc.ShouldBindJSON(&req)'),
		).toEqual({ kind: 'named', type: 'models.Settings' });
	});

	it('exposes the list form of a json.RawMessage body that unmarshals into a slice', () => {
		const go = [
			'var raw json.RawMessage',
			'c.ShouldBindJSON(&raw)',
			'var data []models.AddContact',
			'json.Unmarshal(raw, &data)',
		].join('\n');
		expect(body(go)).toEqual({ kind: 'array', type: 'models.AddContact' });
	});

	it('exposes the id list of a selection body tried as a bare array first', () => {
		const go = [
			'var raw json.RawMessage',
			'c.ShouldBindJSON(&raw)',
			'var sel models.Selection',
			'if err := json.Unmarshal(raw, &sel.Contacts); err != nil {',
			'json.Unmarshal(raw, &sel)',
		].join('\n');
		expect(body(go)).toEqual({ kind: 'array', type: 'string' });
	});

	it('falls back to a raw body when nothing says what the JSON holds', () => {
		expect(body('var raw json.RawMessage\nc.ShouldBindJSON(&raw)')).toEqual({ kind: 'raw' });
	});
});

describe('parenDepth', () => {
	it('is positive while a route registration is still open', () => {
		expect(run(`parenDepth('g.GET("/x", m.Require(a),')`)).toBe(1);
	});

	it('ignores parentheses inside strings and comments', () => {
		expect(run(`parenDepth('g.GET("/x(", h.X) // note (')`)).toBe(0);
	});
});
