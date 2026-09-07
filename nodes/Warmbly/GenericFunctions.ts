import { createHmac, timingSafeEqual } from 'crypto';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Verify a Warmbly webhook signature header of the form `t=<ts>,v1=<hex>`.
 * The signed payload is `<t>.<rawBody>`, HMAC-SHA256 with the endpoint's secret.
 * Pure and constant-time; returns false on any missing or malformed input so
 * callers can treat `false` as "reject the delivery".
 */
export function verifyWarmblySignature(
	secret: string,
	signatureHeader: string,
	rawBody: string,
): boolean {
	if (!secret || !signatureHeader) {
		return false;
	}
	const parts: Record<string, string> = {};
	for (const segment of signatureHeader.split(',')) {
		const idx = segment.indexOf('=');
		if (idx > 0) {
			parts[segment.slice(0, idx).trim()] = segment.slice(idx + 1).trim();
		}
	}
	const timestamp = parts.t;
	const provided = parts.v1;
	if (typeof provided !== 'string') {
		return false;
	}
	const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
	return (
		provided.length === expected.length &&
		timingSafeEqual(Buffer.from(provided, 'utf8'), Buffer.from(expected, 'utf8'))
	);
}

type WarmblyContext =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions;

/**
 * Resolve the configured base URL, defaulting to Warmbly Cloud and stripping a
 * trailing slash so endpoint concatenation is always clean.
 */
async function getBaseUrl(this: WarmblyContext): Promise<string> {
	const credentials = await this.getCredentials('warmblyApi');
	const baseUrl = (credentials.baseUrl as string) || 'https://api.warmbly.com/v1';
	return baseUrl.replace(/\/+$/, '');
}

/**
 * Make an authenticated request against the Warmbly API. The credential's
 * `authenticate` block injects the `Authorization: Bearer <key>` header.
 */
export async function warmblyApiRequest(
	this: WarmblyContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] | string = {},
	qs: IDataObject = {},
	headers: IDataObject = {},
	option: Partial<IHttpRequestOptions> = {},
): Promise<any> {
	const baseUrl = await getBaseUrl.call(this);

	const options: IHttpRequestOptions = {
		method,
		body,
		qs,
		url: `${baseUrl}${endpoint}`,
		headers,
		json: true,
		...option,
	};

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}
	if (Object.keys(headers).length === 0) {
		delete options.headers;
	}
	const isEmptyObjectBody =
		!Array.isArray(body) && typeof body === 'object' && Object.keys(body).length === 0;
	// A GET or DELETE carries no body. A POST/PUT/PATCH keeps its `{}`: several
	// Warmbly endpoints take an all-optional body and reject a request with no
	// body at all (the JSON decoder sees EOF), so dropping it would break
	// "start this with the defaults" calls such as the campaign estimate.
	if (method === 'GET' || method === 'HEAD' || (isEmptyObjectBody && method === 'DELETE')) {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'warmblyApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Multipart upload helper for the few endpoints that accept files
 * (campaign attachments, contact CSV/XLSX import). Uses the legacy request
 * helper because it natively supports `formData` streaming.
 */
export async function warmblyApiUpload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	formData: IDataObject,
): Promise<any> {
	const baseUrl = await getBaseUrl.call(this);

	const options: IRequestOptions = {
		method,
		formData,
		uri: `${baseUrl}${endpoint}`,
		json: true,
	};

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'warmblyApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Pull the array payload out of a Warmbly response. List endpoints use a
 * `{ data, pagination }` envelope; a handful use a single named array
 * (`endpoints`, `event_types`, `drops`). Anything else is wrapped as one item.
 */
export function extractArray(response: any): IDataObject[] {
	if (Array.isArray(response)) {
		return response as IDataObject[];
	}
	if (response && typeof response === 'object') {
		if (Array.isArray(response.data)) {
			return response.data as IDataObject[];
		}
		for (const key of Object.keys(response)) {
			if (Array.isArray((response as IDataObject)[key])) {
				return (response as IDataObject)[key] as IDataObject[];
			}
		}
	}
	return response === undefined ? [] : [response as IDataObject];
}

/**
 * Follow the opaque `pagination.next_cursor` token until it runs out,
 * accumulating every page's `data` rows.
 */
export async function warmblyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const query: IDataObject = { ...qs };
	if (query.limit === undefined) {
		query.limit = 100;
	}

	let nextCursor: string | undefined;
	do {
		if (nextCursor) {
			query.cursor = nextCursor;
		}
		const response = await warmblyApiRequest.call(this, method, endpoint, body, query);
		returnData.push(...extractArray(response));
		nextCursor =
			(response?.pagination?.next_cursor as string | undefined) ??
			(response?.pagination?.cursor as string | undefined) ??
			undefined;
	} while (nextCursor);

	return returnData;
}

/** Coerce a node-parameter value into the shape the API expects for its type. */
export function coerceValue(value: unknown, type: string): unknown {
	if (value === undefined || value === null) {
		return value;
	}
	if (type === 'json') {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed === '') {
				return undefined;
			}
			try {
				return JSON.parse(trimmed);
			} catch {
				return value;
			}
		}
		return value;
	}
	if (type === 'stringArray') {
		if (Array.isArray(value)) {
			return value;
		}
		if (typeof value === 'string') {
			return value
				.split(',')
				.map((part) => part.trim())
				.filter((part) => part.length > 0);
		}
		return value;
	}
	if (type === 'number') {
		return typeof value === 'string' ? Number(value) : value;
	}
	return value;
}

// ---------------------------------------------------------------------------
// loadOptions helpers: populate dropdowns from live workspace data.
// ---------------------------------------------------------------------------

export async function getPipelines(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await warmblyApiRequest.call(this, 'GET', '/crm/pipelines');
	return extractArray(response).map((pipeline) => ({
		name: (pipeline.name as string) ?? (pipeline.id as string),
		value: pipeline.id as string,
	}));
}

export async function getPipelineStages(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const pipelineId = this.getCurrentNodeParameter('pipeline_id') as string;
	if (!pipelineId) {
		return [];
	}
	const response = await warmblyApiRequest.call(this, 'GET', `/crm/pipelines/${pipelineId}`);
	const stages = (response?.stages ?? response?.data?.stages ?? []) as IDataObject[];
	return stages.map((stage) => ({
		name: (stage.name as string) ?? (stage.id as string),
		value: stage.id as string,
	}));
}

export async function getEventTypes(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await warmblyApiRequest.call(this, 'GET', '/webhooks/event-types');
	return extractArray(response).map((event) => ({
		name: `${(event.category as string) ?? 'Event'}: ${event.type as string}${
			event.firehose ? ' (firehose)' : ''
		}`,
		value: event.type as string,
		description: event.description as string,
	}));
}
