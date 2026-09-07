/**
 * The coverage promise, checked without a network or a backend checkout:
 * every operation Warmbly's API serves to an API key is one the node can call,
 * every operation the node offers is one the API serves, and every field the
 * registry sends has somewhere in the UI to come from.
 *
 * `spec/warmbly-api.json` is the recorded API surface (regenerate it with
 * `npm run api:sync` against a Warmbly checkout); the node is generated from it
 * with `npm run generate`. A failure here means one of the two was not re-run.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

import { fieldProperties, operationProperties, resourceProperty } from '../../nodes/Warmbly/descriptions';
import { RESOURCE_OPERATIONS } from '../../nodes/Warmbly/OperationRegistry';

interface SurfaceOperation {
	method: string;
	path: string;
	handler: string;
}

const surface = JSON.parse(
	readFileSync(join(__dirname, '..', '..', 'spec', 'warmbly-api.json'), 'utf8'),
) as { operations: SurfaceOperation[] };

/** Method plus path with parameter names erased, so `{id}` and `{gid}` match. */
const routeKey = (method: string, path: string): string =>
	`${method} ${path
		.split('/')
		.map((segment) => (segment.startsWith('{') ? '{}' : segment))
		.join('/')}`;

const registryRoutes = new Map<string, string>();
for (const [resource, operations] of Object.entries(RESOURCE_OPERATIONS)) {
	for (const [operation, meta] of Object.entries(operations)) {
		registryRoutes.set(routeKey(meta.method, meta.path), `${resource}.${operation}`);
	}
}

describe('API coverage', () => {
	it('reaches every operation the API serves to an API key', () => {
		const missing = surface.operations
			.filter((op) => !registryRoutes.has(routeKey(op.method, op.path)))
			.map((op) => `${op.method} ${op.path} (${op.handler})`);
		expect(missing).toEqual([]);
	});

	it('offers no operation the API does not serve', () => {
		const served = new Set(surface.operations.map((op) => routeKey(op.method, op.path)));
		const orphans = [...registryRoutes.entries()]
			.filter(([route]) => !served.has(route))
			.map(([route, name]) => `${name} -> ${route}`);
		expect(orphans).toEqual([]);
	});

	it('maps each route to exactly one operation', () => {
		const seen = new Map<string, string[]>();
		for (const [resource, operations] of Object.entries(RESOURCE_OPERATIONS)) {
			for (const [operation, meta] of Object.entries(operations)) {
				const route = routeKey(meta.method, meta.path);
				seen.set(route, [...(seen.get(route) ?? []), `${resource}.${operation}`]);
			}
		}
		const duplicated = [...seen.entries()]
			.filter(([, names]) => names.length > 1)
			.map(([route, names]) => `${route}: ${names.join(', ')}`);
		expect(duplicated).toEqual([]);
	});
});

describe('node descriptions', () => {
	const resourceValues = new Set(resourceProperty.options?.map((o) => (o as { value: string }).value));

	it('lists every resource in the dropdown', () => {
		const missing = Object.keys(RESOURCE_OPERATIONS).filter((r) => !resourceValues.has(r));
		expect(missing).toEqual([]);
	});

	it('offers every operation in its resource dropdown', () => {
		const offered = new Set<string>();
		for (const property of operationProperties) {
			for (const resource of property.displayOptions?.show?.resource ?? []) {
				for (const option of property.options ?? []) {
					offered.add(`${String(resource)}.${(option as { value: string }).value}`);
				}
			}
		}
		const missing: string[] = [];
		for (const [resource, operations] of Object.entries(RESOURCE_OPERATIONS)) {
			for (const operation of Object.keys(operations)) {
				if (!offered.has(`${resource}.${operation}`)) missing.push(`${resource}.${operation}`);
			}
		}
		expect(missing).toEqual([]);
	});

	it('gives every registry field a way to be filled in', () => {
		// resource.operation.collection-or-top.field, as the node resolves it.
		const declared = new Set<string>();
		for (const property of fieldProperties) {
			const show = property.displayOptions?.show ?? {};
			for (const resource of show.resource ?? []) {
				for (const operation of show.operation ?? []) {
					const prefix = `${String(resource)}.${String(operation)}`;
					if (property.type === 'collection') {
						for (const option of property.options ?? []) {
							declared.add(
								`${prefix}.${property.name}.${(option as { name: string }).name}`,
							);
						}
					} else {
						declared.add(`${prefix}.top.${property.name}`);
					}
				}
			}
		}

		const unreachable: string[] = [];
		for (const [resource, operations] of Object.entries(RESOURCE_OPERATIONS)) {
			for (const [operation, meta] of Object.entries(operations)) {
				for (const field of meta.fields) {
					const key = `${resource}.${operation}.${field.loc}.${field.name}`;
					if (!declared.has(key)) unreachable.push(key);
				}
			}
		}
		expect(unreachable).toEqual([]);
	});

	it('asks for a binary property on every upload', () => {
		const uploads = Object.entries(RESOURCE_OPERATIONS).flatMap(([resource, operations]) =>
			Object.entries(operations)
				.filter(([, meta]) => meta.multipart)
				.map(([operation]) => `${resource}.${operation}`),
		);
		const withBinaryField = new Set<string>();
		for (const property of fieldProperties) {
			if (property.name !== 'binaryPropertyName') continue;
			const show = property.displayOptions?.show ?? {};
			for (const resource of show.resource ?? []) {
				for (const operation of show.operation ?? []) {
					withBinaryField.add(`${String(resource)}.${String(operation)}`);
				}
			}
		}
		expect(uploads.filter((op) => !withBinaryField.has(op))).toEqual([]);
	});
});
