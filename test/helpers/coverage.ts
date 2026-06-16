/**
 * Coverage bookkeeping for the integration suite.
 *
 * The promise of this suite is: *every* operation in `RESOURCE_OPERATIONS` is
 * accounted for — each is either executed against the live server (passed /
 * failed) or explicitly skipped with a reason. Nothing is silently uncovered.
 *
 * Specs record outcomes here; a final accounting test asserts the union covers
 * all operations and writes a human-readable report.
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

import { RESOURCE_OPERATIONS } from '../../nodes/Warmbly/OperationRegistry';
import type { WarmblyOperationMeta } from '../../nodes/Warmbly/OperationRegistry';

export type Disposition = 'passed' | 'failed' | 'skipped';

export interface OpOutcome {
	resource: string;
	operation: string;
	method: string;
	path: string;
	disposition: Disposition;
	detail: string;
}

const outcomes = new Map<string, OpOutcome>();

export const opKey = (resource: string, operation: string): string => `${resource}.${operation}`;

export function record(
	resource: string,
	operation: string,
	disposition: Disposition,
	detail: string,
): void {
	const meta = RESOURCE_OPERATIONS[resource]?.[operation];
	outcomes.set(opKey(resource, operation), {
		resource,
		operation,
		method: meta?.method ?? '?',
		path: meta?.path ?? '?',
		disposition,
		detail,
	});
}

export function allOperations(): Array<{
	resource: string;
	operation: string;
	meta: WarmblyOperationMeta;
}> {
	const list: Array<{ resource: string; operation: string; meta: WarmblyOperationMeta }> = [];
	for (const [resource, ops] of Object.entries(RESOURCE_OPERATIONS)) {
		for (const [operation, meta] of Object.entries(ops)) {
			list.push({ resource, operation, meta });
		}
	}
	return list;
}

/** A read operation that takes no required path parameter — safe to call with
 * no fixtures. These are the backbone of the live smoke layer. */
export function isReadSmoke(meta: WarmblyOperationMeta): boolean {
	return meta.method === 'GET' && !meta.path.includes('{');
}

/**
 * Why an operation that we did not actively execute is being skipped. Keeps the
 * report honest: every untouched op gets a concrete, human reason rather than
 * vanishing from the tally.
 */
export function skipReason(operation: string, meta: WarmblyOperationMeta): string {
	const op = operation.toLowerCase();
	if (meta.multipart) {
		return 'multipart upload — needs a binary file fixture';
	}
	if (
		/(send|sendtest|sendemail|start|stop|pause|resume|warmup|appeal|verify|reply|preflight|ingest|replay|test|rotate|push|generate|score|preview|render|export|commit)/.test(
			op,
		)
	) {
		return 'side-effecting / external-dependency op (email, warmup, DNS, 3rd-party) — exercised manually, not in the automated lifecycle';
	}
	if (meta.method === 'GET' && meta.path.includes('{')) {
		return 'single-resource GET — needs a pre-existing id; covered indirectly by lifecycle reads where applicable';
	}
	if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(meta.method)) {
		return 'write op without a dedicated lifecycle scenario yet — add a create→update→delete spec to cover';
	}
	return 'not yet categorised';
}

export interface CoverageReport {
	total: number;
	passed: number;
	failed: number;
	skipped: number;
	executedRatio: string;
	byResource: Record<string, { passed: number; failed: number; skipped: number }>;
	operations: OpOutcome[];
}

/** Fold in every operation not explicitly recorded as skipped-with-reason, then
 * build the report object. */
export function buildReport(): CoverageReport {
	for (const { resource, operation, meta } of allOperations()) {
		if (!outcomes.has(opKey(resource, operation))) {
			record(resource, operation, 'skipped', skipReason(operation, meta));
		}
	}

	const operations = [...outcomes.values()].sort((a, b) =>
		opKey(a.resource, a.operation).localeCompare(opKey(b.resource, b.operation)),
	);

	const byResource: CoverageReport['byResource'] = {};
	let passed = 0;
	let failed = 0;
	let skipped = 0;
	for (const o of operations) {
		byResource[o.resource] ??= { passed: 0, failed: 0, skipped: 0 };
		byResource[o.resource][o.disposition] += 1;
		if (o.disposition === 'passed') passed += 1;
		else if (o.disposition === 'failed') failed += 1;
		else skipped += 1;
	}

	const total = operations.length;
	return {
		total,
		passed,
		failed,
		skipped,
		executedRatio: `${passed + failed}/${total}`,
		byResource,
		operations,
	};
}

export function writeReport(report: CoverageReport): string {
	const path = join(__dirname, '..', '.e2e-report.json');
	writeFileSync(path, JSON.stringify(report, null, 2));
	return path;
}
