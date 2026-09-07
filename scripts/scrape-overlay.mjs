#!/usr/bin/env node
/**
 * Capture the node's hand-written vocabulary into `spec/node-overlay.json`.
 *
 * The generator derives structure from the API surface, but the words a user
 * reads — resource labels, operation names and actions, field display names and
 * their prose — are editorial. This reads them back out of the built node so a
 * regeneration keeps every phrase that already shipped, and so the overlay is
 * the one file to edit when a phrase should change.
 *
 * Run after `npm run build`:
 *   node scripts/scrape-overlay.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

const require = createRequire(import.meta.url);
const DIST = join(process.cwd(), 'dist', 'nodes', 'Warmbly');
if (!existsSync(join(DIST, 'descriptions', 'index.js'))) {
	console.error('Build first: npm run build');
	process.exit(1);
}

const { resourceProperty, operationProperties, fieldProperties } = require(
	join(DIST, 'descriptions', 'index.js'),
);
const { RESOURCE_OPERATIONS } = require(join(DIST, 'OperationRegistry.js'));

const overlayPath = join(process.cwd(), 'spec', 'node-overlay.json');
const existing = existsSync(overlayPath)
	? JSON.parse(readFileSync(overlayPath, 'utf8'))
	: { resources: {}, operations: {}, fields: {} };

const overlay = {
	resources: { ...existing.resources },
	operations: { ...existing.operations },
	fields: { ...existing.fields },
};

// Resource labels, in the order the dropdown lists them.
for (const option of resourceProperty.options) {
	overlay.resources[option.value] = {
		...overlay.resources[option.value],
		displayName: option.name,
	};
}

// Operation labels: one `operation` property per resource.
for (const property of operationProperties) {
	const resources = property.displayOptions?.show?.resource ?? [];
	for (const resource of resources) {
		overlay.resources[resource] = {
			...overlay.resources[resource],
			defaultOperation: property.default,
		};
		for (const option of property.options ?? []) {
			overlay.operations[`${resource}.${option.value}`] = {
				name: option.name,
				action: option.action,
				description: option.description,
			};
		}
	}
}

/** Everything about a property except where it is shown. */
function fieldShape(property) {
	const shape = {
		displayName: property.displayName,
		type: property.type,
		default: property.default,
	};
	if (property.description) shape.description = property.description;
	if (property.required) shape.required = true;
	if (property.placeholder) shape.placeholder = property.placeholder;
	if (property.typeOptions) shape.typeOptions = property.typeOptions;
	if (property.options && property.type === 'options') shape.options = property.options;
	if (property.hint) shape.hint = property.hint;
	return shape;
}

const STRUCTURAL = new Set(['returnAll', 'limit']);

for (const property of fieldProperties) {
	const show = property.displayOptions?.show ?? {};
	const resources = show.resource ?? [];
	const operations = show.operation ?? [];
	for (const resource of resources) {
		for (const operation of operations) {
			if (STRUCTURAL.has(property.name)) continue;
			if (property.type === 'collection' || property.type === 'fixedCollection') {
				overlay.fields[`${resource}.${operation}.${property.name}`] = {
					displayName: property.displayName,
					collection: true,
					placeholder: property.placeholder,
				};
				for (const option of property.options ?? []) {
					overlay.fields[
						`${resource}.${operation}.${property.name}.${option.name}`
					] = fieldShape(option);
				}
				continue;
			}
			overlay.fields[`${resource}.${operation}.top.${property.name}`] =
				fieldShape(property);
		}
	}
}

// The registry says where each field travels; the overlay says how it reads.
// Recording the pairing makes an unused overlay entry easy to spot later.
const known = new Set();
for (const [resource, ops] of Object.entries(RESOURCE_OPERATIONS)) {
	for (const [operation, meta] of Object.entries(ops)) {
		known.add(`${resource}.${operation}`);
		for (const field of meta.fields) {
			known.add(`${resource}.${operation}.${field.loc}.${field.name}`);
		}
	}
}

writeFileSync(overlayPath, JSON.stringify(sortKeys(overlay), null, '\t') + '\n');

function sortKeys(value) {
	if (Array.isArray(value)) return value;
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.keys(value)
				.sort()
				.map((key) => [key, sortKeys(value[key])]),
		);
	}
	return value;
}

console.log(
	`overlay: ${Object.keys(overlay.resources).length} resources, ` +
		`${Object.keys(overlay.operations).length} operations, ` +
		`${Object.keys(overlay.fields).length} field labels -> spec/node-overlay.json`,
);
