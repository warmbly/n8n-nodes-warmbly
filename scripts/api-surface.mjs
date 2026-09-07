#!/usr/bin/env node
/**
 * Extract Warmbly's API-key-reachable HTTP surface into `spec/warmbly-api.json`.
 *
 * The Warmbly backend is the source of truth, not its OpenAPI document: the
 * document lags (it described 153 paths while the router served 305 operations
 * an API key can call). So the surface is read from the router and handlers,
 * and the OpenAPI file is used only to *enrich* what it happens to describe
 * (prose, enums, formats).
 *
 * Usage:
 *   WARMBLY_REPO=~/projects/warmbly node scripts/api-surface.mjs
 *
 * The result is committed so the generator and the coverage check run without a
 * backend checkout.
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

import {
	docAbove,
	flattenStruct,
	indexHandlerServices,
	indexEnums,
	indexHandlers,
	indexInterfaceMethods,
	indexStructs,
	stripPkg,
} from './lib/go-source.mjs';

const REPO = resolve(
	process.env.WARMBLY_REPO || join(homedir(), 'projects', 'warmbly'),
);
if (!existsSync(join(REPO, 'internal', 'api', 'routes.go'))) {
	console.error(`No Warmbly checkout at ${REPO}. Set WARMBLY_REPO.`);
	process.exit(1);
}

const ROUTES_FILE = join(REPO, 'internal/api/routes.go');
const HANDLER_DIR = join(REPO, 'internal/api/handler');
const MODELS_DIR = join(REPO, 'internal/models');
const OPENAPI_FILE = join(REPO, 'docs/public/openapi.json');
const CLI_SPEC_FILE = join(REPO, 'cmd/cli/specs.go');

// ---------------------------------------------------------------------------
// 1. The router: which method+path pairs an API key can reach.
// ---------------------------------------------------------------------------

/**
 * Walk the gin route table. Groups are resolved by variable name, so a route's
 * full path is its own literal appended to its group chain, and the chain also
 * says which auth group it sits under (`protected` = JWT or API key; `jwtOnly`
 * = session only, and so out of scope for a node driven by an API key).
 */
function parseRoutes() {
	const src = readFileSync(ROUTES_FILE, 'utf8');
	const lines = src.split('\n');
	// `mountPublicAPI(v1)` is the only call site, so `base` is always /v1.
	const prefix = new Map([
		['r', ''],
		['v1', '/v1'],
		['base', '/v1'],
	]);
	const parent = new Map();
	const routes = [];

	const groupRe = /^\s*(\w+)\s*:?=\s*(\w+)\.Group\("([^"]*)"\)/;
	const routeRe = /^\s*(\w+)\.(GET|POST|PUT|PATCH|DELETE)\("([^"]*)"\s*,?(.*)$/;
	const grouphRe = /^\s*grouph\.New\((\w+),[^,]+,[^,]+,\s*"(\w+)"/;

	const chainOf = (v) => {
		const chain = [v];
		let cur = v;
		while (parent.has(cur)) {
			cur = parent.get(cur);
			chain.push(cur);
		}
		return chain;
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		const g = groupRe.exec(line);
		if (g) {
			const [, name, from, path] = g;
			prefix.set(name, (prefix.get(from) ?? '') + path);
			parent.set(name, from);
			continue;
		}

		// The generic group CRUD helper registers four routes of its own for
		// campaign folders, mailbox tags and contact categories.
		const gh = grouphRe.exec(line);
		if (gh) {
			const [, from, name] = gh;
			const base = `${prefix.get(from) ?? ''}/${name}`;
			const doc = docAbove(lines, i);
			for (const [method, suffix, handler] of [
				['POST', '', 'Create'],
				['PATCH', '/:gid', 'Update'],
				['PATCH', '/:gid/move', 'Move'],
				['DELETE', '/:gid', 'Delete'],
			]) {
				routes.push({
					method,
					path: base + suffix,
					handler: `grouph.${handler}`,
					group: name,
					chain: [name, ...chainOf(from)],
					doc,
					line: i + 1,
				});
			}
			continue;
		}

		const r = routeRe.exec(line);
		if (!r) continue;
		const [, groupVar, method, path, rest] = r;
		const handlers = [...rest.matchAll(/h\.(\w+)\b/g)].map((m) => m[1]);
		routes.push({
			method,
			path: (prefix.get(groupVar) ?? `?${groupVar}`) + path,
			handler: handlers.length ? handlers[handlers.length - 1] : '',
			chain: chainOf(groupVar),
			apiPerms: [...rest.matchAll(/models\.(APIPerm\w+)/g)].map((m) => m[1]),
			doc: docAbove(lines, i),
			line: i + 1,
		});
	}

	return routes;
}

// ---------------------------------------------------------------------------
// 2. The handlers: what each operation reads off the request.
// ---------------------------------------------------------------------------

const handlers = indexHandlers([HANDLER_DIR]);
// Request structs live mostly in `internal/models`, but a few services define
// their own request type (e.g. emailsend.SendEmailRequest) and the handler
// binds straight onto it.
const structs = indexStructs([MODELS_DIR, HANDLER_DIR, join(REPO, 'internal/app')]);
const handlerServices = indexHandlerServices(HANDLER_DIR);
const goEnums = indexEnums([MODELS_DIR, HANDLER_DIR, join(REPO, 'internal/app')]);
const interfaceMethods = indexInterfaceMethods(join(REPO, 'internal/app'));

/** Package-level helpers that read the request on a handler's behalf. */
function indexRequestHelpers() {
	const helpers = new Map();
	const seen = new Set();
	for (const { file } of handlers.values()) {
		if (seen.has(file)) continue;
		seen.add(file);
		const lines = readFileSync(file, 'utf8').split('\n');
		for (let i = 0; i < lines.length; i++) {
			const m = /^func (\w+)\((?:\w+ )?\*?gin\.Context/.exec(lines[i]);
			if (!m) continue;
			let depth = 0;
			const body = [];
			for (let j = i; j < lines.length; j++) {
				body.push(lines[j]);
				depth += (lines[j].match(/\{/g) || []).length;
				depth -= (lines[j].match(/\}/g) || []).length;
				if (j > i && depth <= 0) break;
			}
			helpers.set(m[1], body.join('\n'));
		}
	}
	return helpers;
}

const requestHelpers = indexRequestHelpers();

/**
 * A handler body plus the bodies of anything it hands the request to: package
 * helpers (`decodeCursor(c)`) and shared handler methods (the one-line
 * `StartWarmup` delegates the whole request to `h.warmupLifecycle`).
 */
function effectiveBody(body, depth = 0, seen = new Set()) {
	if (depth > 3) return body;
	let out = body;
	for (const [name, helperBody] of requestHelpers) {
		if (seen.has(`fn:${name}`) || out === helperBody) continue;
		if (new RegExp(`\\b${name}\\(c[,)]`).test(out)) {
			seen.add(`fn:${name}`);
			out += '\n' + effectiveBody(helperBody, depth + 1, seen);
		}
	}
	for (const [name, helper] of handlers) {
		if (seen.has(`m:${name}`) || out === helper.body) continue;
		if (new RegExp(`\\bh\\.${name}\\(c[,)]`).test(out)) {
			seen.add(`m:${name}`);
			out += '\n' + effectiveBody(helper.body, depth + 1, seen);
		}
	}
	return out;
}

const QUERY_RES = [
	/c\.Query\("([^"]+)"\)/g,
	/c\.DefaultQuery\("([^"]+)"/g,
	/c\.GetQuery\("([^"]+)"\)/g,
	/c\.QueryArray\("([^"]+)"\)/g,
	/c\.Request\.URL\.Query\(\)\.Get\("([^"]+)"\)/g,
];

function queryParams(body) {
	const names = new Set();
	for (const re of QUERY_RES) {
		for (const m of body.matchAll(re)) names.add(m[1]);
	}
	const arrays = new Set([...body.matchAll(/c\.QueryArray\("([^"]+)"\)/g)].map((m) => m[1]));
	return [...names].map((name) => ({ name, array: arrays.has(name) }));
}

/** The struct a handler binds the query string to (`form:"…"` tags), if any. */
function boundQuery(body) {
	const bind = /ShouldBindQuery\(&(\w+)\)/.exec(body);
	if (!bind) return null;
	const typed = new RegExp(`var ${bind[1]} ((?:\\w+\\.)?\\w+)\\s*$`, 'm').exec(body);
	return typed ? typed[1] : null;
}

/** The struct a handler binds the JSON body to, if any. */
function boundBody(body) {
	const bind = /(?:ShouldBindJSON|BindJSON|ShouldBindWith|ShouldBind)\(&(\w+)\)/.exec(body);
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

/** Map a Go type onto the wire type the node's registry understands. */
export function wireType(goType) {
	const t = goType.replace(/^\*/, '');
	if (t.startsWith('[]')) {
		const inner = t.slice(2).replace(/^\*/, '');
		if (['string', 'uuid.UUID'].includes(inner)) return 'stringArray';
		if (goEnums.has(stripPkg(inner))) return 'stringArray';
		return 'json';
	}
	if (t.startsWith('map[')) return 'json';
	// A string alias with a const block behind it is a closed set of values.
	if (goEnums.has(stripPkg(t))) return 'options';
	if (/^(\w+\.)?(NullableTime|Date|NullableDate)$/.test(t)) return 'dateTime';
	if (['string', 'uuid.UUID'].includes(t)) return 'string';
	if (t === 'json.RawMessage') return 'json';
	if (/^(int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64)$/.test(t)) {
		return 'number';
	}
	if (t === 'bool') return 'boolean';
	if (t === 'time.Time') return 'dateTime';
	if (t === 'any' || t === 'interface{}') return 'json';
	// A named type: an enum-ish string alias, or a nested object.
	const decl = structs.get(stripPkg(t));
	if (decl) return 'json';
	if (/Kind|Status|State|Type|Source|Mode|Match|Category|Direction|Provider$/.test(stripPkg(t))) {
		return 'string';
	}
	return 'json';
}

/**
 * One body field as a parameter: the Go type decides the shape, the enum (from
 * the Go const block, or the OpenAPI document when Go's type is a plain string)
 * decides whether it is a closed set, and the prose comes from whichever source
 * bothered to write it.
 */
function bodyParam(field, hints, route) {
	const hint = hints?.params.get(field.name);
	const goEnum = goEnums.get(stripPkg(field.goType.replace(/^[*\[\]]+/, '')));
	const values = goEnum ?? hint?.enum;
	let type = wireType(field.goType);
	if (values && type === 'string') type = 'options';
	// The document knows a formatted string the Go type erases (a date sent as a
	// plain string, say); trust it only where Go has nothing better to say.
	if (type === 'json' && hint && ['string', 'integer', 'number', 'boolean'].includes(hint.type)) {
		type = openApiType(hint);
	}
	return {
		in: 'body',
		name: field.name,
		type,
		goType: field.goType,
		required: field.required || (hint?.required ?? false),
		description:
			field.description ||
			hint?.description ||
			cliDescription(route.method, route.path, field.name),
		enum: values,
	};
}

/**
 * Does the operation answer with a list the node should unwrap into items?
 * Three tells, in order of confidence: an inline `{"data": …}` envelope, a
 * response struct that declares a `data` field, and finally a handler that
 * names itself a listing.
 */
function respondsWithList(body, handlerName) {
	if (/gin\.H\{\s*"data":/.test(body)) return true;
	if (/"data":\s*\w+/.test(body)) return true;
	for (const m of body.matchAll(/c\.JSON\([^,]+,\s*&?(\w+)\)/g)) {
		const type = variableType(body, m[1]) ?? serviceResultType(body, m[1]);
		if (isListType(type)) return true;
	}
	// `c.JSON(http.StatusOK, models.ReplyTemplatesResult{Data: rows})`: the
	// envelope is built inline.
	for (const m of body.matchAll(/c\.JSON\([^,]+,\s*&?((?:\w+\.)?\w+)\{/g)) {
		if (isListType(m[1])) return true;
	}
	// `c.JSON(http.StatusOK, h.TzService.Timezones())`: the service call is the
	// response, with no variable in between.
	for (const m of body.matchAll(/c\.JSON\([^,]+,\s*h\.(\w+)\.(\w+)\(/g)) {
		const service = handlerServices.get(m[1]);
		if (!service) continue;
		if (isListType(interfaceMethods.get(`${service.pkg}.${service.type}.${m[2]}`))) {
			return true;
		}
	}
	return /^(List|Search)/.test(handlerName ?? '');
}

/**
 * A type that carries rows: a slice, or an envelope whose `data` field is one.
 * An envelope with an object-valued `data` (the automation dry run's variable
 * bag, say) is a single result, not a list.
 */
function isListType(type) {
	if (!type) return false;
	const bare = type.replace(/^\*/, '');
	if (bare.startsWith('[]')) return true;
	const decl = structs.get(stripPkg(bare));
	return (
		!!decl &&
		decl.fields.some((f) => f.name === 'data' && (f.goType ?? '').startsWith('[]'))
	);
}

/**
 * The type a handler got back from its service: `result, xerr :=
 * h.CampaignService.GetLogs(…)` resolves through the Handler's field list to
 * `campaign.CampaignService.GetLogs`, whose first return value is the answer.
 */
function serviceResultType(body, variable) {
	const call = new RegExp(
		`\\b${variable}(?:,\\s*\\w+)?\\s*:?=\\s*h\\.(\\w+)\\.(\\w+)\\(`,
		'm',
	).exec(body);
	if (!call) return null;
	const service = handlerServices.get(call[1]);
	if (!service) return null;
	return interfaceMethods.get(`${service.pkg}.${service.type}.${call[2]}`) ?? null;
}

/** The declared type of a local variable, when the declaration is explicit. */
function variableType(body, variable) {
	const declared = new RegExp(`var ${variable} ((?:\\w+\\.)?\\w+)`, 'm').exec(body);
	if (declared) return declared[1];
	const literal = new RegExp(`${variable}\\s*:?=\\s*&?((?:\\w+\\.)?\\w+)\\{`, 'm').exec(body);
	return literal ? literal[1] : null;
}

// ---------------------------------------------------------------------------
// 3. OpenAPI enrichment for the paths the document does describe.
// ---------------------------------------------------------------------------

function loadOpenApi() {
	if (!existsSync(OPENAPI_FILE)) return { byKey: new Map(), schemas: {} };
	const doc = JSON.parse(readFileSync(OPENAPI_FILE, 'utf8'));
	const byKey = new Map();
	for (const [path, ops] of Object.entries(doc.paths ?? {})) {
		for (const [method, op] of Object.entries(ops)) {
			if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
			byKey.set(routeKey(method.toUpperCase(), path), { path, op });
		}
	}
	return { byKey, schemas: doc.components?.schemas ?? {} };
}

/** Method + path with parameter names erased, so `:id` and `{id}` compare equal. */
export function routeKey(method, path) {
	const normalized = normalizePath(path)
		.split('/')
		.map((segment) => (segment.startsWith('{') ? '{}' : segment))
		.join('/');
	return `${method.toUpperCase()} ${normalized}`;
}

/** `/v1/campaigns/:id/steps` -> `/campaigns/{id}/steps`. */
export function normalizePath(path) {
	return (
		path
			.replace(/^\/v1/, '')
			.replace(/:(\w+)/g, (_, name) => `{${name}}`)
			.replace(/\/$/, '') || '/'
	);
}

const openapi = loadOpenApi();

/** Follow a $ref into the document's schema table. */
function deref(schema) {
	let cur = schema;
	for (let i = 0; i < 8 && cur && cur.$ref; i++) {
		const name = cur.$ref.replace('#/components/schemas/', '');
		cur = openapi.schemas[name];
	}
	return cur ?? {};
}

/** Prose, enum and format hints for one operation, keyed by parameter name. */
function openApiHints(method, path) {
	const entry = openapi.byKey.get(routeKey(method, path));
	if (!entry) return null;
	const { op } = entry;
	const hints = { summary: op.summary ?? '', description: op.description ?? '', params: new Map() };
	for (const raw of op.parameters ?? []) {
		const param = raw.$ref ? deref(raw) : raw;
		if (!param?.name) continue;
		const schema = deref(param.schema ?? {});
		hints.params.set(param.name, {
			in: param.in,
			description: param.description ?? '',
			required: !!param.required,
			enum: schema.enum,
			format: schema.format,
			type: schema.type,
			default: schema.default,
		});
	}
	const bodySchema = deref(op.requestBody?.content?.['application/json']?.schema ?? {});
	if (bodySchema.properties) {
		for (const [name, raw] of Object.entries(bodySchema.properties)) {
			const prop = deref(raw);
			hints.params.set(name, {
				in: 'body',
				description: prop.description ?? '',
				required: (bodySchema.required ?? []).includes(name),
				enum: prop.enum,
				format: prop.format,
				type: prop.type,
				default: prop.default,
			});
		}
	}
	return hints;
}

// ---------------------------------------------------------------------------
// 3b. The CLI's own help text, for parameters nothing else documents.
// ---------------------------------------------------------------------------

/**
 * `cmd/cli/specs.go` describes the same endpoints for `warmbly` on the command
 * line, one row per endpoint with a help string per flag. Those strings were
 * written for the exact method+path they sit under, so they are a safe last
 * resort for a parameter the Go struct and the OpenAPI document both leave
 * undescribed. Returns `METHOD /path` -> { param -> help }.
 */
function loadCliHelp() {
	const help = new Map();
	if (!existsSync(CLI_SPEC_FILE)) return help;
	const src = readFileSync(CLI_SPEC_FILE, 'utf8');
	// Endpoint rows always name their method and path together, so a row runs
	// from one `Method:` to the next.
	const rows = src.split(/\bMethod:\s*http\.Method/).slice(1);
	for (const row of rows) {
		const method = /^(\w+)/.exec(row)?.[1];
		const path = /Path:\s*"([^"]+)"/.exec(row)?.[1];
		if (!method || !path) continue;
		const params = new Map();
		for (const flag of row.matchAll(/\{Name:\s*"([^"]+)"([^}]*)\}/g)) {
			const text = /Help:\s*"((?:[^"\\]|\\.)*)"/.exec(flag[2]);
			if (!text) continue;
			// `Key` renames a flag for the wire; otherwise a kebab-case flag is
			// the snake_case field.
			const key = /Key:\s*"([^"]+)"/.exec(flag[2])?.[1] ?? flag[1].replace(/-/g, '_');
			params.set(key, text[1].replace(/\\"/g, '"'));
		}
		if (params.size) help.set(routeKey(method.toUpperCase(), path), params);
	}
	return help;
}

const cliHelp = loadCliHelp();

/** The CLI's help text for one parameter of one operation, if it wrote any. */
function cliDescription(method, path, name) {
	return cliHelp.get(routeKey(method, path))?.get(name) ?? '';
}

// ---------------------------------------------------------------------------
// 4. Assemble.
// ---------------------------------------------------------------------------

const routes = parseRoutes();
const reachable = routes.filter(
	(r) => r.chain.includes('protected') && !r.chain.includes('jwtOnly') && r.path.startsWith('/v1'),
);

const unresolvedHandlers = [];
const operations = [];
const seenKeys = new Set();

for (const route of reachable) {
	const key = routeKey(route.method, route.path);
	if (seenKeys.has(key)) continue;
	seenKeys.add(key);

	const path = normalizePath(route.path);
	// The generic group CRUD lives in its own package; its four handlers are
	// indexed under their bare names.
	const handler = handlers.get(route.handler.replace(/^grouph\./, ''));
	const body = handler ? effectiveBody(handler.body) : '';
	if (!handler) {
		unresolvedHandlers.push(`${route.method} ${path} -> ${route.handler || '(none)'}`);
	}

	const hints = openApiHints(route.method, path);
	const params = [];

	// Path parameters, in the order the route declares them.
	for (const m of path.matchAll(/\{(\w+)\}/g)) {
		const hint = hints?.params.get(m[1]);
		params.push({
			in: 'path',
			name: m[1],
			type: 'string',
			required: true,
			description: hint?.description || cliDescription(route.method, path, m[1]),
			enum: hint?.enum,
		});
	}

	// Query parameters, whether read one at a time off the context or bound
	// wholesale onto a struct of `form:"…"` tags.
	const fromQueryStruct = [];
	const queryStruct = boundQuery(body);
	if (queryStruct) {
		for (const field of flattenStruct(structs, queryStruct)) {
			fromQueryStruct.push({ name: field.name, array: field.goType.startsWith('[]') });
		}
	}
	const seenQuery = new Set();
	for (const { name, array } of [...queryParams(body), ...fromQueryStruct]) {
		if (seenQuery.has(name)) continue;
		seenQuery.add(name);
		const hint = hints?.params.get(name);
		params.push({
			in: 'query',
			name,
			type: array ? 'stringArray' : openApiType(hint) ?? 'string',
			required: hint?.required ?? false,
			description: hint?.description || cliDescription(route.method, path, name),
			enum: hint?.enum,
		});
	}

	// Body.
	const bound = boundBody(body);
	let bodyKind = null;
	if (bound?.kind === 'named') {
		const fields = flattenStruct(structs, bound.type);
		if (fields.length === 0) {
			unresolvedHandlers.push(
				`${route.method} ${path} -> body struct ${bound.type} not found`,
			);
		}
		for (const field of fields) {
			params.push(bodyParam(field, hints, { method: route.method, path }));
		}
		bodyKind = { kind: 'object', type: bound.type };
	} else if (bound?.kind === 'anonymous') {
		for (const field of bound.fields) {
			params.push(bodyParam(field, hints, { method: route.method, path }));
		}
		bodyKind = { kind: 'object', type: 'inline' };
	} else if (bound?.kind === 'array') {
		bodyKind = {
			kind: 'array',
			type: bound.type,
			// `[]string` is a list a user can type as `a,b,c`; a list of
			// objects has to be JSON.
			itemType: ['string', 'uuid.UUID'].includes(stripPkg(bound.type))
				? 'stringArray'
				: 'json',
		};
	} else if (bound?.kind === 'raw') {
		bodyKind = { kind: 'raw' };
	} else if (bound?.kind === 'unknown') {
		bodyKind = { kind: 'freeform' };
		unresolvedHandlers.push(`${route.method} ${path} -> unrecognised body binding`);
	}

	// A multipart handler reads its non-file fields off the form, not the body.
	const multipart = /c\.(?:Request\.)?FormFile\(/.test(body);
	if (multipart) {
		for (const m of body.matchAll(
			/c\.(?:Request\.)?(?:PostForm|DefaultPostForm|FormValue)\("([^"]+)"/g,
		)) {
			if (params.some((p) => p.name === m[1])) continue;
			const hint = hints?.params.get(m[1]);
			params.push({
				in: 'body',
				name: m[1],
				type: openApiType(hint) ?? 'string',
				required: hint?.required ?? false,
				description: hint?.description ?? '',
				enum: hint?.enum,
			});
		}
	}
	const paginated = params.some((p) => p.in === 'query' && p.name === 'cursor');
	const returnsList =
		respondsWithList(body, route.handler) ||
		// The generic group CRUD helper has no body to read; none of its four
		// routes answer with a list.
		false;

	operations.push({
		method: route.method,
		path,
		handler: route.handler,
		doc: (route.doc || handler?.doc || '').trim(),
		apiPerms: route.apiPerms ?? [],
		params,
		body: bodyKind,
		multipart,
		paginated,
		returnsList,
		openapi: !!hints,
		source: `internal/api/routes.go:${route.line}`,
	});
}

operations.sort((a, b) => (a.path + a.method).localeCompare(b.path + b.method));

function openApiType(hint) {
	if (!hint) return null;
	if (hint.enum) return 'options';
	if (hint.format === 'date-time') return 'dateTime';
	if (hint.type === 'integer' || hint.type === 'number') return 'number';
	if (hint.type === 'boolean') return 'boolean';
	if (hint.type === 'array') return 'stringArray';
	if (hint.type === 'object') return 'json';
	return 'string';
}

let commit = 'unknown';
try {
	commit = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', 'HEAD'], {
		encoding: 'utf8',
	}).trim();
} catch {
	/* a checkout without git history still yields a usable surface */
}

const out = {
	source: { repo: 'warmbly/warmbly', commit, routes: 'internal/api/routes.go' },
	operationCount: operations.length,
	operations,
};
const target = join(process.cwd(), 'spec', 'warmbly-api.json');
writeFileSync(target, JSON.stringify(out, null, '\t') + '\n');

console.log(`${operations.length} API-key-reachable operations -> spec/warmbly-api.json`);
console.log(`  described by the OpenAPI document: ${operations.filter((o) => o.openapi).length}`);
if (unresolvedHandlers.length) {
	console.log(`\n${unresolvedHandlers.length} operations need attention:`);
	for (const line of unresolvedHandlers) console.log(`  ${line}`);
}
