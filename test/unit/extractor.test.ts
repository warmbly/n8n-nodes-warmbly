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
});
