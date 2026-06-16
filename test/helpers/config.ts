/**
 * Shared configuration for the integration suite.
 *
 * Everything is overridable by environment variable so the same specs run
 * against a local `make run` instance, CI, or a throwaway cloud instance.
 *
 *   WARMBLY_BASE_URL   default http://localhost:8080/v1   (the versioned API root)
 *   WARMBLY_API_KEY    default the `make seed` full-access key
 */
export const E2E_BASE_URL = (process.env.WARMBLY_BASE_URL ?? 'http://localhost:8080/v1').replace(
	/\/+$/,
	'',
);

export const E2E_API_KEY =
	process.env.WARMBLY_API_KEY ?? 'wmbly_seed_acme_owner_full_access_0000000000';

/** Per-request timeout for the live API, in milliseconds. */
export const E2E_TIMEOUT_MS = Number(process.env.WARMBLY_TIMEOUT_MS ?? 20_000);
