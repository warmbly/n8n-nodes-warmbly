/**
 * Mint a throwaway, high-rate-limit API key for the test run.
 *
 * Warmbly's default per-key limit is 60 requests / 60s, which a full-surface
 * integration pass blows through. The per-key limit is configurable up to
 * 10,000/min and is NOT capped by plan (see internal/app/apikey/service.go), so
 * we create a dedicated runner key (full access, max limit) using the seed key,
 * and run every test request under it.
 *
 * Best-effort: if minting fails (e.g. the configured key can't manage keys),
 * we fall back to the configured key and let the request layer's backoff cope.
 */
import { E2E_API_KEY, E2E_BASE_URL } from './config';

const MAX_RATE_LIMIT = 10_000;

async function api(method: string, path: string, key: string, body?: unknown): Promise<unknown> {
	const response = await fetch(`${E2E_BASE_URL}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${key}`,
			Accept: 'application/json',
			...(body ? { 'Content-Type': 'application/json' } : {}),
		},
		body: body === undefined ? undefined : JSON.stringify(body),
	});
	const text = await response.text();
	const parsed = text ? JSON.parse(text) : {};
	if (!response.ok) {
		throw new Error(`${method} ${path} → ${response.status}: ${text.slice(0, 300)}`);
	}
	return parsed;
}

const unwrap = (payload: unknown): Record<string, unknown> => {
	const obj = payload as { data?: Record<string, unknown> };
	return (obj.data ?? obj) as Record<string, unknown>;
};

/**
 * Returns a high-limit key secret, or the configured key if minting isn't
 * possible. The boolean reports whether a fresh key was actually created.
 */
export async function mintRunnerKey(
	seedKey: string = E2E_API_KEY,
): Promise<{ key: string; minted: boolean }> {
	try {
		// Discover the full-access permission bitmask from existing keys.
		const list = unwrap(await api('GET', '/api-keys', seedKey));
		const keys = (list.data ?? list) as Array<{ permissions?: number }>;
		const permissions = Math.max(
			0,
			...((Array.isArray(keys) ? keys : []).map((k) => Number(k.permissions) || 0)),
		);
		if (!permissions) {
			return { key: seedKey, minted: false };
		}

		const created = unwrap(
			await api('POST', '/api-keys', seedKey, {
				name: `e2e-runner-${process.pid}`,
				permissions,
				rate_limit_per_minute: MAX_RATE_LIMIT,
			}),
		);
		const secret = (created.secret ?? created.key) as string | undefined;
		return secret ? { key: secret, minted: true } : { key: seedKey, minted: false };
	} catch {
		return { key: seedKey, minted: false };
	}
}
