#!/usr/bin/env node
/**
 * Generate the node's operation registry and resource descriptions.
 *
 * Three inputs, each with one job:
 *   spec/warmbly-api.json    what the API serves (from scripts/api-surface.mjs)
 *   spec/warmbly-events.json the trigger's event catalog (from scripts/events-surface.mjs)
 *   spec/node-mapping.json   which resource + operation each route is called
 *   spec/node-overlay.json   how it reads: labels, prose, curated types
 *
 * Everything under nodes/Warmbly/descriptions and OperationRegistry.ts is
 * written from those; edit the inputs, not the output.
 *
 *   node scripts/generate-node.mjs
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SPEC = join(ROOT, 'spec');
const NODE_DIR = join(ROOT, 'nodes', 'Warmbly');
const DESC_DIR = join(NODE_DIR, 'descriptions');

const surface = readJson(join(SPEC, 'warmbly-api.json'));
const events = readJson(join(SPEC, 'warmbly-events.json'));
const mapping = readJson(join(SPEC, 'node-mapping.json'));
const overlay = readJson(join(SPEC, 'node-overlay.json'));

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

const routeKey = (method, path) =>
	`${method} ${path
		.split('/')
		.map((segment) => (segment.startsWith('{') ? '{}' : segment))
		.join('/')}`;

// ---------------------------------------------------------------------------
// Shared vocabulary
// ---------------------------------------------------------------------------

const IDEMPOTENCY_DESCRIPTION =
	'Optional client-generated key (1 to 255 chars). Retrying with the same key ' +
	'returns the original result instead of acting twice.';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Words the API spells one way and n8n's display style spells another. */
const ACRONYMS = new Map(
	Object.entries({
		id: 'ID',
		ids: 'IDs',
		api: 'API',
		url: 'URL',
		urls: 'URLs',
		uri: 'URI',
		html: 'HTML',
		json: 'JSON',
		csv: 'CSV',
		ai: 'AI',
		utm: 'UTM',
		dns: 'DNS',
		dkim: 'DKIM',
		spf: 'SPF',
		dmarc: 'DMARC',
		smtp: 'SMTP',
		imap: 'IMAP',
		crm: 'CRM',
		esp: 'ESP',
		ab: 'A/B',
		ip: 'IP',
		cc: 'CC',
		bcc: 'BCC',
		sid: 'Step ID',
		gid: 'ID',
		tz: 'Timezone',
		ttl: 'TTL',
		oauth: 'OAuth',
		ui: 'UI',
		mx: 'MX',
	}),
);

/** Case- and punctuation-insensitive comparison, for "is this text a repeat?" */
function normalize(text) {
	return String(text ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/** `body_html` -> `Body HTML`, `contactID` -> `Contact ID`. */
function titleCase(name) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(/[_\-\s]+/)
		.filter(Boolean)
		.map((word) => {
			const lower = word.toLowerCase();
			if (ACRONYMS.has(lower)) return ACRONYMS.get(lower);
			return lower.charAt(0).toUpperCase() + lower.slice(1);
		})
		.join(' ');
}

/** The English plural of a resource label, for "Get many …" phrasing. */
function pluralize(label) {
	if (/(s|x|z|ch|sh)$/i.test(label)) return `${label}es`;
	if (/[^aeiou]y$/i.test(label)) return `${label.slice(0, -1)}ies`;
	return `${label}s`;
}

// ---------------------------------------------------------------------------
// Assemble every operation
// ---------------------------------------------------------------------------

/** Where an optional parameter lives in the node UI. */
function collectionFor(resource, operation, param, meta) {
	const known = overlayLoc(resource, operation, paramName(param, meta));
	if (known) return known;
	if (param.in === 'query' && meta.method === 'GET') return 'filters';
	if (meta.method === 'PATCH' || meta.method === 'PUT') return 'updateFields';
	return 'additionalFields';
}

/** The collection an already-shipped field was placed in, so it stays put. */
function overlayLoc(resource, operation, name) {
	for (const loc of ['filters', 'updateFields', 'additionalFields']) {
		if (overlay.fields[`${resource}.${operation}.${loc}.${name}`]) return loc;
	}
	if (overlay.fields[`${resource}.${operation}.top.${name}`]) return 'top';
	return null;
}

function paramName(param) {
	return param.name;
}

/** Turn one surface operation into its registry entry. */
function buildMeta(op, resource, operation) {
	const meta = { method: op.method, path: op.path, fields: [] };
	const paginated = op.paginated && op.returnsList;

	const bodyOverride = overlay.operations[`${resource}.${operation}`]?.bodyField;
	if (op.body?.kind === 'array' || op.body?.kind === 'raw') {
		const name = bodyOverride ?? 'body';
		const type = op.body.itemType ?? 'json';
		meta.fields.push({
			name,
			apiName: name,
			loc: 'top',
			in: 'body',
			type,
			bodyField: true,
		});
		meta.bodyField = name;
		meta.bodyFieldType = type;
	}

	for (const param of op.params) {
		// Pagination is driven by the node's own Return All / Limit pair.
		if (paginated && param.in === 'query' && ['limit', 'cursor'].includes(param.name)) {
			continue;
		}
		// The uploaded file arrives as binary data, not as a parameter.
		if (op.multipart && param.name === 'file') continue;

		const required = param.in === 'path' || param.required;
		meta.fields.push({
			name: param.name,
			apiName: param.name,
			loc: required ? 'top' : collectionFor(resource, operation, param, meta),
			in: param.in,
			type: param.type,
		});
	}

	if (WRITE_METHODS.has(op.method)) {
		meta.fields.push({
			name: 'idempotencyKey',
			apiName: 'Idempotency-Key',
			loc:
				overlayLoc(resource, operation, 'idempotencyKey') ??
				(op.method === 'PATCH' || op.method === 'PUT'
					? 'updateFields'
					: 'additionalFields'),
			in: 'header',
			type: 'string',
		});
	}

	if (op.returnsList) meta.returnsList = true;
	if (paginated) meta.paginated = true;
	if (op.multipart) meta.multipart = true;
	return meta;
}

const resources = new Map();
const unnamed = [];

for (const op of surface.operations) {
	const key = routeKey(op.method, op.path);
	const named = mapping[key];
	if (!named) {
		unnamed.push(`${key}  (${op.handler})`);
		continue;
	}
	const { resource, operation } = named;
	if (!resources.has(resource)) resources.set(resource, new Map());
	resources.get(resource).set(operation, { op, meta: buildMeta(op, resource, operation) });
}

if (unnamed.length) {
	console.error(
		`${unnamed.length} route(s) have no name in spec/node-mapping.json:\n  ` +
			unnamed.join('\n  '),
	);
	process.exit(1);
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

function resourceLabel(resource) {
	const label = overlay.resources[resource]?.displayName;
	if (!label) {
		throw new Error(
			`No display name for resource "${resource}". Add one to spec/node-overlay.json.`,
		);
	}
	return label;
}

/** The noun used inside an action sentence: "Get a reply template". */
function resourceNoun(resource) {
	return overlay.resources[resource]?.noun ?? resourceLabel(resource).toLowerCase();
}

/** "a campaign" but "an AI skill". */
function article(noun) {
	return /^[aeiou]/i.test(noun) ? 'an' : 'a';
}

const CRUD_LABELS = {
	getAll: (resource) => ({
		name: 'Get Many',
		action: `Get many ${pluralize(resourceNoun(resource))}`,
	}),
	get: (resource) => ({
		name: 'Get',
		action: `Get ${article(resourceNoun(resource))} ${resourceNoun(resource)}`,
	}),
	create: (resource) => ({
		name: 'Create',
		action: `Create ${article(resourceNoun(resource))} ${resourceNoun(resource)}`,
	}),
	update: (resource) => ({
		name: 'Update',
		action: `Update ${article(resourceNoun(resource))} ${resourceNoun(resource)}`,
	}),
	delete: (resource) => ({
		name: 'Delete',
		action: `Delete ${article(resourceNoun(resource))} ${resourceNoun(resource)}`,
	}),
};

function operationLabels(resource, operation) {
	const curated = overlay.operations[`${resource}.${operation}`];
	if (curated?.name && curated?.action) {
		return {
			name: curated.name,
			action: curated.action,
			description: curated.description ?? curated.action,
		};
	}
	const derived = CRUD_LABELS[operation]?.(resource) ?? {
		name: titleCase(operation),
		action: `${titleCase(operation)} ${resourceNoun(resource)}`,
	};
	const name = curated?.name ?? derived.name;
	const action = curated?.action ?? derived.action;
	return { name, action, description: curated?.description ?? action };
}

/** How one field reads in the node panel. */
function fieldUi(resource, operation, field, param) {
	const curated =
		overlay.fields[`${resource}.${operation}.${field.loc}.${field.name}`] ??
		overlay.fields[`${resource}.${operation}.top.${field.name}`];
	if (curated) return curated;

	const ui = {
		displayName: titleCase(field.name),
		type: nodeType(field.type),
		default: defaultFor(field.type, param),
	};
	// A colour gets a colour picker, and an address field gets the address
	// placeholder n8n's own nodes use.
	if (ui.type === 'string' && /(^|_)colou?r$/.test(field.name)) {
		ui.type = 'color';
	}
	if (ui.type === 'string' && /(^|_)e?mail$/.test(field.name)) {
		ui.placeholder = 'name@email.com';
	}
	if (field.name === 'idempotencyKey') {
		ui.displayName = 'Idempotency Key';
		ui.description = IDEMPOTENCY_DESCRIPTION;
	}
	if (field.bodyField) {
		ui.description = 'The request body. Provide as JSON.';
	}
	const description = describe(field, param);
	if (description) ui.description = description;
	if (param?.enum?.length) {
		ui.options = param.enum
			.map((value) => ({ name: titleCase(String(value)), value }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
	return ui;
}

function describe(field, param) {
	let text = (param?.description ?? '').trim();
	if (text.length > 300) text = text.slice(0, 297).trimEnd() + '…';
	const suffix =
		field.type === 'stringArray'
			? 'Comma-separated list.'
			: field.type === 'json'
				? 'Provide as JSON.'
				: '';
	if (!text) return suffix;
	if (!suffix) return text;
	return /[.!?]$/.test(text) ? `${text} ${suffix}` : `${text}. ${suffix}`;
}

function nodeType(type) {
	if (type === 'stringArray') return 'string';
	return type;
}

function defaultFor(type, param) {
	switch (type) {
		case 'number':
			return typeof param?.default === 'number' ? param.default : 0;
		case 'boolean':
			return typeof param?.default === 'boolean' ? param.default : false;
		case 'options':
			return param?.enum?.[0] ?? '';
		default:
			return '';
	}
}

// ---------------------------------------------------------------------------
// Emit TypeScript
// ---------------------------------------------------------------------------

/** Serialize a plain value as TypeScript source, tab-indented. */
function ts(value, depth = 1) {
	const pad = '\t'.repeat(depth);
	const padEnd = '\t'.repeat(depth - 1);
	if (Array.isArray(value)) {
		if (value.length === 0) return '[]';
		return `[\n${value.map((v) => pad + ts(v, depth + 1)).join(',\n')},\n${padEnd}]`;
	}
	if (value && typeof value === 'object') {
		const entries = Object.entries(value).filter(([, v]) => v !== undefined);
		if (entries.length === 0) return '{}';
		return `{\n${entries
			.map(([k, v]) => `${pad}${tsKey(k)}: ${ts(v, depth + 1)}`)
			.join(',\n')},\n${padEnd}}`;
	}
	if (typeof value === 'string') return quote(value);
	return String(value);
}

function tsKey(key) {
	return /^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key);
}

function quote(text) {
	return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const orderedResources = [...resources.keys()].sort((a, b) =>
	resourceLabel(a).localeCompare(resourceLabel(b)),
);

/** Operations in the order the dropdown lists them. */
function orderedOperations(resource) {
	return [...resources.get(resource).keys()].sort((a, b) =>
		operationLabels(resource, a).name.localeCompare(operationLabels(resource, b).name),
	);
}

function writeRegistry() {
	const lines = [
		'// AUTO-GENERATED by scripts/generate-node.mjs from spec/warmbly-api.json.',
		'// Do not edit by hand: run `npm run generate` instead.',
		'export interface WarmblyFieldMeta {',
		'\tname: string;',
		'\tapiName: string;',
		"\tloc: string; // 'top' or the collection property name",
		"\tin: 'path' | 'query' | 'body' | 'header';",
		'\ttype: string;',
		'\tbodyField?: boolean;',
		'}',
		'',
		'export interface WarmblyOperationMeta {',
		'\tmethod: string;',
		'\tpath: string;',
		'\tfields: WarmblyFieldMeta[];',
		'\treturnsList?: boolean;',
		'\tpaginated?: boolean;',
		'\tbodyField?: string;',
		'\tbodyFieldType?: string;',
		'\tmultipart?: boolean;',
		'}',
		'',
		'export const RESOURCE_OPERATIONS: Record<string, Record<string, WarmblyOperationMeta>> = {',
	];

	for (const resource of orderedResources) {
		lines.push(`\t${tsKey(resource)}: {`);
		for (const operation of orderedOperations(resource)) {
			const { meta } = resources.get(resource).get(operation);
			lines.push(`\t\t${tsKey(operation)}: ${ts(meta, 3)},`);
		}
		lines.push('\t},');
	}
	lines.push('};', '');
	writeFileSync(join(NODE_DIR, 'OperationRegistry.ts'), lines.join('\n'));
}

function writeResourceDescription(resource) {
	const label = resourceLabel(resource);
	const operations = orderedOperations(resource);
	const options = operations.map((operation) => {
		const { name, action, description } = operationLabels(resource, operation);
		// n8n hides a description that only repeats the option's name.
		const same = normalize(description) === normalize(name);
		return { name, value: operation, action, ...(same ? {} : { description }) };
	});

	const defaultOperation =
		overlay.resources[resource]?.defaultOperation ??
		(operations.includes('getAll') ? 'getAll' : operations[0]);

	const operationProperty = {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options,
		default: defaultOperation,
	};

	const fields = [];
	for (const operation of operations) {
		const { op, meta } = resources.get(resource).get(operation);
		const show = { resource: [resource], operation: [operation] };
		const paramByName = new Map(op.params.map((p) => [p.name, p]));

		if (meta.paginated) {
			fields.push({
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: { show },
			});
			fields.push({
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { ...show, returnAll: [false] } },
			});
		}

		for (const field of meta.fields.filter((f) => f.loc === 'top')) {
			const param = paramByName.get(field.name);
			const ui = fieldUi(resource, operation, field, param);
			// A field the API does not force but the node has always asked for
			// (the ids a bulk action operates on) stays required.
			const required =
				field.bodyField || field.in === 'path' || !!param?.required || !!ui.required;
			fields.push({
				displayName: ui.displayName,
				name: field.name,
				type: ui.type ?? nodeType(field.type),
				...(ui.typeOptions ? { typeOptions: ui.typeOptions } : {}),
				...(ui.options ? { options: ui.options } : {}),
				default: ui.default ?? defaultFor(field.type, param),
				...(required ? { required: true } : {}),
				...(ui.description ? { description: ui.description } : {}),
				...(ui.placeholder ? { placeholder: ui.placeholder } : {}),
				displayOptions: { show },
			});
		}

		if (meta.multipart) {
			const ui = overlay.fields[`${resource}.${operation}.top.binaryPropertyName`];
			fields.push({
				displayName: ui?.displayName ?? 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: ui?.default ?? 'data',
				required: true,
				description:
					ui?.description ??
					'The name of the input binary field holding the file to upload',
				displayOptions: { show },
			});
		}

		for (const loc of ['filters', 'updateFields', 'additionalFields']) {
			const inLoc = meta.fields.filter((f) => f.loc === loc);
			if (inLoc.length === 0) continue;
			const collectionUi = overlay.fields[`${resource}.${operation}.${loc}`];
			const collectionOptions = inLoc
				.map((field) => {
					const ui = fieldUi(
						resource,
						operation,
						field,
						paramByName.get(field.name),
					);
					return {
						displayName: ui.displayName,
						name: field.name,
						type: ui.type ?? nodeType(field.type),
						...(ui.typeOptions ? { typeOptions: ui.typeOptions } : {}),
						...(ui.options ? { options: ui.options } : {}),
						default:
							ui.default ??
							defaultFor(field.type, paramByName.get(field.name)),
						...(ui.description ? { description: ui.description } : {}),
						...(ui.placeholder ? { placeholder: ui.placeholder } : {}),
					};
				})
				.sort((a, b) => a.displayName.localeCompare(b.displayName));

			fields.push({
				displayName:
					collectionUi?.displayName ??
					(loc === 'filters'
						? 'Filters'
						: loc === 'updateFields'
							? 'Update Fields'
							: 'Additional Fields'),
				name: loc,
				type: 'collection',
				placeholder: collectionUi?.placeholder ?? 'Add Field',
				default: {},
				displayOptions: { show },
				options: collectionOptions,
			});
		}
	}

	const source = [
		"import type { INodeProperties } from 'n8n-workflow';",
		'',
		`// AUTO-GENERATED by scripts/generate-node.mjs. Edit spec/node-overlay.json instead.`,
		`export const ${resource}Operations: INodeProperties[] = [`,
		`\t${ts(operationProperty, 2)},`,
		'];',
		'',
		`export const ${resource}Fields: INodeProperties[] = [`,
		...fields.map((field) => `\t${ts(field, 2)},`),
		'];',
		'',
	].join('\n');
	writeFileSync(join(DESC_DIR, `${resource}.ts`), source);
	return label;
}

function writeIndex() {
	const imports = orderedResources
		.map(
			(resource) =>
				`import { ${resource}Operations, ${resource}Fields } from './${resource}';`,
		)
		.join('\n');

	const options = orderedResources
		.map((resource) => ({ name: resourceLabel(resource), value: resource }))
		.sort((a, b) => a.name.localeCompare(b.name));

	const resourceProperty = {
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options,
		default: 'campaign',
	};

	const source = [
		"import type { INodeProperties } from 'n8n-workflow';",
		'',
		imports,
		'',
		'// AUTO-GENERATED by scripts/generate-node.mjs. Edit spec/node-overlay.json instead.',
		`export const resourceProperty: INodeProperties = ${ts(resourceProperty, 1)};`,
		'',
		'export const operationProperties: INodeProperties[] = [',
		...orderedResources.map((resource) => `\t...${resource}Operations,`),
		'];',
		'',
		'export const fieldProperties: INodeProperties[] = [',
		...orderedResources.map((resource) => `\t...${resource}Fields,`),
		'];',
		'',
	].join('\n');
	writeFileSync(join(DESC_DIR, 'index.ts'), source);
}

// A resource that loses its last operation should lose its file too.
for (const file of readdirSync(DESC_DIR)) {
	const resource = file.replace(/\.ts$/, '');
	if (resource === 'index' || resources.has(resource)) continue;
	unlinkSync(join(DESC_DIR, file));
	console.log(`removed descriptions/${file} (no operations left)`);
}

function writeWebhookEvents() {
	const options = events.events.map(
		(event) =>
			'\t{\n' +
			`\t\tname: ${quote(event.name)},\n` +
			`\t\tvalue: ${quote(event.value)},\n` +
			`\t\tdescription: ${quote(event.description)},\n` +
			'\t},',
	);
	writeFileSync(
		join(NODE_DIR, 'WebhookEvents.ts'),
		[
			"import type { INodePropertyOptions } from 'n8n-workflow';",
			'',
			"// AUTO-GENERATED by scripts/generate-node.mjs from Warmbly's outbound",
			'// webhook event catalog. Do not edit by hand.',
			'export const webhookEvents: INodePropertyOptions[] = [',
			...options,
			'];',
			'',
		].join('\n'),
	);
}

writeRegistry();
for (const resource of orderedResources) writeResourceDescription(resource);
writeIndex();
writeWebhookEvents();

const operationCount = [...resources.values()].reduce((sum, ops) => sum + ops.size, 0);
console.log(
	`${operationCount} operations across ${resources.size} resources -> ` +
		'OperationRegistry.ts + descriptions/',
);
console.log(`${events.events.length} webhook events -> WebhookEvents.ts`);

if (!existsSync(join(SPEC, 'node-overlay.json'))) {
	console.log('note: no overlay found; every label was derived');
}
