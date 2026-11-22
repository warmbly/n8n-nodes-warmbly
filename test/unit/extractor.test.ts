/**
 * The Go-source extractor in scripts/lib reads handler and struct patterns.
 * These cover the shapes that once slipped through: wrapped route
 * registrations, embedded structs from another package, and two packages that
 * each declare a struct of the same name. The scripts are ES modules, so each
 * case runs in a child Node process against a throwaway Go tree.
 */
import { execFileSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const LIB = join(__dirname, '..', '..', 'scripts', 'lib', 'go-source.mjs');

function run(script: string): unknown {
	const out = execFileSync('node', ['--input-type=module', '-e', script], {
		encoding: 'utf8',
	});
	return JSON.parse(out);
}

function goTree(files: Record<string, string>): string {
	const root = mkdtempSync(join(tmpdir(), 'warmbly-go-'));
	for (const [name, source] of Object.entries(files)) {
		const path = join(root, name);
		mkdirSync(join(path, '..'), { recursive: true });
		writeFileSync(path, source);
	}
	return root;
}

describe('go-source extractor', () => {
	it('counts parentheses across a wrapped route registration', () => {
		const result = run(`
			import { parenDepth } from ${JSON.stringify(LIB)};
			console.log(JSON.stringify([
				parenDepth('g.GET("/lookup", m.Require(a),'),
				parenDepth('  m.Other("x)", b), h.Handler)'),
				parenDepth('g.GET("/a", h.A) // trailing )'),
			]));
		`);
		expect(result).toEqual([1, -1, 0]);
	});

	it('flattens an embedded struct from another package', () => {
		const root = goTree({
			'models/sel.go': 'package models\n\ntype Selection struct {\n\tAll bool `json:"all"`\n}\n',
			'handler/h.go':
				'package handler\n\ntype bulkPatch struct {\n\tmodels.Selection\n\tNotes string `json:"notes"`\n}\n',
		});
		const result = run(`
			import { indexStructs, flattenStruct } from ${JSON.stringify(LIB)};
			const s = indexStructs([${JSON.stringify(root)}]);
			console.log(JSON.stringify(flattenStruct(s, 'bulkPatch').map((f) => f.name)));
		`);
		expect(result).toEqual(['all', 'notes']);
	});

	it('tells apart same-named structs in different packages', () => {
		const root = goTree({
			'a/s.go': 'package a\n\ntype Settings struct {\n}\n',
			'b/s.go': 'package b\n\ntype Settings struct {\n\tEnabled bool `json:"enabled"`\n}\n',
		});
		const result = run(`
			import { indexStructs, flattenStruct } from ${JSON.stringify(LIB)};
			const s = indexStructs([${JSON.stringify(root)}]);
			console.log(JSON.stringify(flattenStruct(s, 'b.Settings').map((f) => f.name)));
		`);
		expect(result).toEqual(['enabled']);
	});

	it('reads the Go type a query value is converted to', () => {
		const result = run(`
			import { typedQueryReads } from ${JSON.stringify(LIB)};
			const body = [
				'out, err := svc.Preview(ctx, id, models.ClientReportRange(c.Query("range")))',
				'cat := AdvisorCategory(c.DefaultQuery("category", "all"))',
				'q := strings.TrimSpace(c.Query("q"))',
				'plain := c.Query("cursor")',
			].join('\\n');
			console.log(JSON.stringify([...typedQueryReads(body)]));
		`);
		expect(result).toEqual([
			['range', 'ClientReportRange'],
			['category', 'AdvisorCategory'],
			['q', 'TrimSpace'],
		]);
	});

	it('indexes string aliases that have no const block', () => {
		const root = goTree({
			'pkg/source/source.go': 'package source\n\ntype ProviderID string\n\ntype Config struct {\n}\n',
			'pkg/tool/tool.go': 'package tool\n\nconst ID source.ProviderID = "tool"\n',
		});
		const result = run(`
			import { indexStringTypes } from ${JSON.stringify(LIB)};
			console.log(JSON.stringify([...indexStringTypes([${JSON.stringify(root)}])]));
		`);
		expect(result).toEqual(['ProviderID']);
	});
	it('follows a raw body read into the struct it is decoded into', () => {
		const result = run(`
			import { rawBodyTarget } from ${JSON.stringify(LIB)};
			const update = [
				'raw, err := c.GetRawData()',
				'var in apollo.SourceInput',
				'if err := json.Unmarshal(raw, &in); err != nil {',
				'var probe map[string]json.RawMessage',
				'if json.Unmarshal(raw, &probe) == nil {',
			].join('\\n');
			const probeFirst = [
				'body, _ := c.GetRawData()',
				'var probe map[string]any',
				'_ = json.Unmarshal(body, &probe)',
				'var req models.Patch',
				'_ = json.Unmarshal(body, &req)',
			].join('\\n');
			console.log(JSON.stringify([
				rawBodyTarget(update),
				rawBodyTarget(probeFirst),
				rawBodyTarget('var in models.X\\nc.ShouldBindJSON(&in)'),
			]));
		`);
		expect(result).toEqual(['in', 'req', null]);
	});
	it('reads group middleware across a wrapped Use call', () => {
		const result = run(`
			import { groupMiddleware, groupsUsing } from ${JSON.stringify(LIB)};
			const lines = [
				'protected := base.Group("")',
				'protected.Use(m.CombinedAuthMiddleware(), m.IdempotencyMiddleware())',
				'secrets := base.Group("/store")',
				'secrets.Use(m.CombinedAuthMiddleware(), m.ResourceScopeGate(),',
				'	m.RequireOrganization(), m.RateLimitMiddleware(models.RateLimitWrite))',
				'jwtOnly := base.Group("")',
				'jwtOnly.Use(m.AuthMiddleware())',
			];
			const mw = groupMiddleware(lines);
			console.log(JSON.stringify([
				[...groupsUsing(mw, 'CombinedAuthMiddleware')],
				[...groupsUsing(mw, 'IdempotencyMiddleware')],
			]));
		`);
		expect(result).toEqual([['protected', 'secrets'], ['protected']]);
	});
	it('finds a body bound with a binding argument', () => {
		const result = run(`
			import { bodyBindCall } from ${JSON.stringify(LIB)};
			console.log(JSON.stringify([
				bodyBindCall('if err := c.ShouldBindJSON(&in); err != nil {'),
				bodyBindCall('if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {'),
				bodyBindCall('_ = c.ShouldBindQuery(&q)'),
			]));
		`);
		expect(result).toEqual([
			['ShouldBindJSON(&in)', 'in'],
			['ShouldBindBodyWith(&req, binding.JSON)', 'req'],
			null,
		]);
	});
});
