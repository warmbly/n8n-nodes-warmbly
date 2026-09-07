/**
 * A mock n8n execution context that drives the *real* Warmbly node code against
 * a *real* Warmbly server.
 *
 * The node's `execute()` only depends on a handful of `IExecuteFunctions`
 * members: parameter access, credentials, and the `helpers.*http*` request
 * functions. We implement exactly those, but route the request helpers at a
 * live HTTP call instead of n8n's internal client, so every test exercises the
 * node's real field-mapping, pagination, multipart and response-extraction
 * logic, end to end, exactly as n8n would at runtime.
 */
import type { IExecuteFunctions } from 'n8n-workflow';

import { Warmbly } from '../../nodes/Warmbly/Warmbly.node';
import { E2E_API_KEY, E2E_BASE_URL, E2E_TIMEOUT_MS } from './config';

type Params = Record<string, unknown>;

/**
 * The key every request runs under. Defaults to the configured key, but the
 * suite swaps in a freshly-minted high-rate-limit key at startup so a few dozen
 * calls don't trip the default 60/min limit. See test/helpers/runnerKey.ts.
 */
let runtimeApiKey = E2E_API_KEY;
export const setRuntimeApiKey = (key: string): void => {
	runtimeApiKey = key;
};
export const getRuntimeApiKey = (): string => runtimeApiKey;

export interface BinaryFixture {
	property: string;
	fileName: string;
	mimeType: string;
	buffer: Buffer;
}

export interface ContextOptions {
	apiKey?: string;
	baseUrl?: string;
	binary?: BinaryFixture;
}

interface HttpOptions {
	method?: string;
	url?: string;
	uri?: string;
	qs?: Record<string, unknown>;
	body?: unknown;
	headers?: Record<string, string>;
	json?: boolean;
	formData?: Record<string, unknown>;
}

/** An HTTP error shaped like the one n8n's http helpers throw, so the node's
 * `NodeApiError` wrapping behaves the same as in production. */
export interface HttpError extends Error {
	httpCode: string;
	statusCode: number;
	response: { status: number; body: unknown };
}

function appendQuery(base: string, qs?: Record<string, unknown>): string {
	if (!qs || Object.keys(qs).length === 0) {
		return base;
	}
	const usp = new URLSearchParams();
	for (const [key, value] of Object.entries(qs)) {
		if (value === undefined || value === null) {
			continue;
		}
		if (Array.isArray(value)) {
			value.forEach((item) => usp.append(key, String(item)));
		} else {
			usp.append(key, String(value));
		}
	}
	const query = usp.toString();
	if (!query) {
		return base;
	}
	return `${base}${base.includes('?') ? '&' : '?'}${query}`;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Transient statuses worth retrying: rate limiting and server hiccups. */
const RETRYABLE = new Set([429, 502, 503, 504]);
const MAX_ATTEMPTS = 8;

/**
 * Minimum spacing between request *starts*. The suite issues requests serially
 * (jest --runInBand), but back-to-back `fetch`es land ~100+/s, which trips a
 * fine-grained burst limiter even though the per-minute volume is tiny. Spacing
 * to ~25/s keeps us comfortably under it; override with WARMBLY_MIN_INTERVAL_MS.
 */
const MIN_INTERVAL_MS = Number(process.env.WARMBLY_MIN_INTERVAL_MS ?? 40);
let lastRequestStart = 0;

async function pace(): Promise<void> {
	const wait = MIN_INTERVAL_MS - (Date.now() - lastRequestStart);
	if (wait > 0) {
		await sleep(wait);
	}
	lastRequestStart = Date.now();
}

async function liveRequest(apiKey: string, options: HttpOptions): Promise<unknown> {
	const target = options.url ?? options.uri ?? '';
	const url = appendQuery(target, options.qs);

	const headers: Record<string, string> = {
		Authorization: `Bearer ${apiKey}`,
		Accept: 'application/json',
		...(options.headers ?? {}),
	};

	const method = (options.method ?? 'GET').toUpperCase();

	let body: BodyInit | undefined;
	if (options.formData) {
		const form = new FormData();
		for (const [key, value] of Object.entries(options.formData)) {
			if (value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)) {
				const file = value as { value: Buffer; options?: { filename?: string; contentType?: string } };
				const blob = new Blob([file.value], { type: file.options?.contentType });
				form.append(key, blob, file.options?.filename ?? 'upload');
			} else {
				form.append(key, String(value));
			}
		}
		body = form;
	} else if (options.body !== undefined && method !== 'GET') {
		headers['Content-Type'] = 'application/json';
		body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
	}

	for (let attempt = 1; ; attempt += 1) {
		await pace();
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), E2E_TIMEOUT_MS);
		let response: Response;
		try {
			response = await fetch(url, { method, headers, body, signal: controller.signal });
		} finally {
			clearTimeout(timer);
		}

		// Back off and retry on rate limiting / transient server errors.
		if (RETRYABLE.has(response.status) && attempt < MAX_ATTEMPTS) {
			const retryAfter = Number(response.headers.get('retry-after'));
			// Honour Retry-After so we ride out a full per-user rate-limit window
			// (capped so a single call can't hang indefinitely). The per-test
			// timeout is raised to match. With a quiet API this path is rare.
			const waitMs =
				Number.isFinite(retryAfter) && retryAfter > 0
					? Math.min(65_000, retryAfter * 1000 + 500)
					: Math.min(2000, 250 * 2 ** (attempt - 1));
			await sleep(waitMs);
			continue;
		}

		const text = await response.text();
		let parsed: unknown;
		if (text) {
			try {
				parsed = JSON.parse(text);
			} catch {
				parsed = text;
			}
		}

		if (!response.ok) {
			const error = new Error(
				`Warmbly API ${response.status} ${response.statusText} on ${method} ${url}: ${text.slice(0, 600)}`,
			) as HttpError;
			error.httpCode = String(response.status);
			error.statusCode = response.status;
			error.response = { status: response.status, body: parsed ?? text };
			throw error;
		}

		return parsed ?? {};
	}
}

/** Best-effort extraction of an HTTP status from whatever the node re-threw. */
export function httpStatusOf(error: unknown): number | undefined {
	const candidate = error as { httpCode?: unknown; statusCode?: unknown; message?: unknown };
	const fromCode = Number(candidate?.httpCode ?? candidate?.statusCode);
	if (Number.isInteger(fromCode) && fromCode > 0) {
		return fromCode;
	}
	const match = String(candidate?.message ?? error).match(/\b(\d{3})\b/);
	return match ? Number(match[1]) : undefined;
}

function buildContext(params: Params, opts: ContextOptions = {}): IExecuteFunctions {
	const apiKey = opts.apiKey ?? runtimeApiKey;
	const baseUrl = opts.baseUrl ?? E2E_BASE_URL;

	const helpers = {
		async httpRequestWithAuthentication(_credType: string, options: HttpOptions) {
			return liveRequest(apiKey, options);
		},
		async requestWithAuthentication(_credType: string, options: HttpOptions) {
			return liveRequest(apiKey, options);
		},
		returnJsonArray(items: unknown) {
			const arr = Array.isArray(items) ? items : [items];
			return arr.map((json) => ({ json }));
		},
		constructExecutionMetaData(data: Array<Record<string, unknown>>, meta: { itemData: unknown }) {
			return data.map((entry) => ({ ...entry, pairedItem: meta.itemData }));
		},
		assertBinaryData(_i: number, _property: string) {
			return { fileName: opts.binary?.fileName, mimeType: opts.binary?.mimeType };
		},
		async getBinaryDataBuffer(_i: number, _property: string) {
			return opts.binary?.buffer ?? Buffer.from('');
		},
	};

	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name: string, _itemIndex: number, fallback?: unknown) => {
			const value = params[name];
			return value === undefined ? fallback : value;
		},
		getCredentials: async (_name: string) => ({ apiKey, baseUrl }),
		getNode: () => ({
			name: 'Warmbly',
			type: 'n8n-nodes-warmbly.warmbly',
			typeVersion: 1,
			position: [0, 0] as [number, number],
			parameters: {},
		}),
		continueOnFail: () => false,
		helpers,
	};

	return context as unknown as IExecuteFunctions;
}

/**
 * Run a single Warmbly node operation against the live server and return the
 * node's output items (the `json` payloads only). Throws (a `NodeApiError`,
 * exactly as in n8n) on any non-2xx response.
 */
export async function runOperation(
	resource: string,
	operation: string,
	params: Params = {},
	opts: ContextOptions = {},
): Promise<Array<Record<string, unknown>>> {
	const context = buildContext({ resource, operation, ...params }, opts);
	const node = new Warmbly();
	const output = await node.execute.call(context);
	return output[0].map((item) => item.json as Record<string, unknown>);
}
