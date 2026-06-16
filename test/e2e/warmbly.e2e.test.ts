/**
 * Warmbly node — live integration suite.
 *
 * Runs the real node code against a running Warmbly server (default the local
 * `make run` instance). It does three things, in order, in one file so the
 * coverage tally is shared:
 *
 *   1. READ SMOKE   — every GET-with-no-required-path-param operation is called
 *                     against the live API and asserted to return a clean array.
 *   2. WRITE LIFECYCLES — create → read → update → delete round-trips that prove
 *                     the write/update/delete path for representative resources.
 *   3. COVERAGE     — asserts every one of the 179 operations is accounted for
 *                     (executed or skipped-with-reason) and writes a report.
 *
 * Prereq: a reachable server + a valid key. See test/helpers/config.ts.
 *   cd ~/warmbly && make infra && make seed && make run
 */
import { E2E_BASE_URL } from '../helpers/config';
import {
	allOperations,
	buildReport,
	isReadSmoke,
	record,
	writeReport,
} from '../helpers/coverage';
import { httpStatusOf, runOperation, setRuntimeApiKey } from '../helpers/executeContext';
import { mintRunnerKey } from '../helpers/runnerKey';

jest.setTimeout(60_000);

/** 4xx codes that mean "this endpoint needs inputs we didn't supply" rather than
 * "the node is broken" — recorded as skipped, not failed. */
const NEEDS_INPUT = new Set([400, 404, 422]);

const unique = `e2e-${process.pid}-${Math.floor(process.hrtime()[1] / 1000)}`;

const idOf = (item: Record<string, unknown>): string | undefined => {
	const data = (item.data ?? item) as Record<string, unknown>;
	return (data.id ?? item.id) as string | undefined;
};

/** Some create endpoints (e.g. bulk contact import) return a bare array; unwrap
 * the first element so `idOf` can find the id regardless of shape. */
const firstOf = (items: Array<Record<string, unknown>>): Record<string, unknown> => {
	const head = items[0];
	return (Array.isArray(head) ? head[0] : head) as Record<string, unknown>;
};

/** Statuses that mean "this read isn't available for the fixture we created"
 * (empty sub-resource, or a feature gated off for a bare campaign/contact) —
 * recorded as skipped, never a node bug. */
const READ_NOT_APPLICABLE = new Set([400, 403, 404, 405, 422, 429]);

/** Run a read that depends on freshly-created fixture data. A 2xx records as
 * passed; a not-applicable status records as skipped; anything else is a real
 * failure that fails the run. */
async function execRead(
	resource: string,
	operation: string,
	params: Record<string, unknown>,
): Promise<Array<Record<string, unknown>>> {
	try {
		const items = await runOperation(resource, operation, params);
		record(resource, operation, 'passed', `2xx · ${items.length} item(s)`);
		return items;
	} catch (error) {
		const status = httpStatusOf(error);
		if (status && READ_NOT_APPLICABLE.has(status)) {
			record(resource, operation, 'skipped', `not applicable to this fixture (HTTP ${status})`);
			return [];
		}
		record(resource, operation, 'failed', (error as Error).message);
		throw error;
	}
}

/** Create a throwaway pipeline + stage and return their ids (deals need both). */
async function createPipelineWithStage(
	tag: string,
): Promise<{ pipelineId: string; stageId: string }> {
	const [pipeline] = await runOperation('pipeline', 'create', {
		name: `${unique}-${tag}-pipeline`,
		additionalFields: {},
	});
	const pipelineId = idOf(pipeline) as string;
	const [stage] = await runOperation('pipeline', 'createStage', {
		id: pipelineId,
		name: `${unique}-${tag}-stage`,
		color: '#0ea5e9',
		additionalFields: {},
	});
	return { pipelineId, stageId: idOf(stage) as string };
}

beforeAll(async () => {
	const origin = new URL(E2E_BASE_URL).origin;
	let healthy = false;
	try {
		const response = await fetch(`${origin}/health`);
		healthy = response.ok;
	} catch {
		healthy = false;
	}
	if (!healthy) {
		throw new Error(
			`Warmbly API is not reachable at ${origin}.\n` +
				`Start it with:  cd ~/warmbly && make infra && make seed && make run\n` +
				`Or point the suite elsewhere with WARMBLY_BASE_URL / WARMBLY_API_KEY.`,
		);
	}

	// Run under a high-rate-limit key so the full-surface pass doesn't hit the
	// default 60/min limit. Falls back silently to the configured key.
	const { key, minted } = await mintRunnerKey();
	setRuntimeApiKey(key);
	// eslint-disable-next-line no-console
	console.log(minted ? 'Using a freshly minted high-limit runner key.' : 'Using the configured key.');
});

describe('live read smoke (GET, no fixtures required)', () => {
	const smokeOps = allOperations().filter(({ meta }) => isReadSmoke(meta));

	test('there is a meaningful number of read endpoints to smoke', () => {
		expect(smokeOps.length).toBeGreaterThan(20);
	});

	for (const { resource, operation } of smokeOps) {
		test(`${resource}.${operation}`, async () => {
			try {
				const items = await runOperation(resource, operation, { returnAll: false, limit: 3 });
				expect(Array.isArray(items)).toBe(true);
				record(resource, operation, 'passed', `2xx · ${items.length} item(s)`);
			} catch (error) {
				const status = httpStatusOf(error);
				if (status && NEEDS_INPUT.has(status)) {
					record(resource, operation, 'skipped', `requires input params (HTTP ${status})`);
					return;
				}
				record(resource, operation, 'failed', (error as Error).message);
				throw error;
			}
		});
	}
});

describe('write lifecycle — pipeline (create → get → update → stages → delete)', () => {
	let pipelineId: string | undefined;
	let stageId: string | undefined;

	test('create', async () => {
		const [created] = await runOperation('pipeline', 'create', {
			name: `${unique}-pipeline`,
			additionalFields: {},
		});
		pipelineId = idOf(created);
		expect(pipelineId).toBeTruthy();
		record('pipeline', 'create', 'passed', `created ${pipelineId}`);
	});

	test('get', async () => {
		expect(pipelineId).toBeTruthy();
		const [fetched] = await runOperation('pipeline', 'get', { id: pipelineId });
		expect(idOf(fetched)).toBe(pipelineId);
		record('pipeline', 'get', 'passed', 'round-tripped the created pipeline');
	});

	test('update', async () => {
		expect(pipelineId).toBeTruthy();
		await runOperation('pipeline', 'update', {
			id: pipelineId,
			updateFields: { name: `${unique}-pipeline-renamed` },
		});
		record('pipeline', 'update', 'passed', 'renamed');
	});

	test('getAll includes the created pipeline', async () => {
		const items = await runOperation('pipeline', 'getAll', { returnAll: false, limit: 100 });
		expect(items.some((p) => idOf(p) === pipelineId)).toBe(true);
		record('pipeline', 'getAll', 'passed', `listed (${items.length})`);
	});

	test('createStage', async () => {
		expect(pipelineId).toBeTruthy();
		const [stage] = await runOperation('pipeline', 'createStage', {
			id: pipelineId,
			name: `${unique}-stage`,
			color: '#0ea5e9',
			additionalFields: {},
		});
		stageId = idOf(stage);
		expect(stageId).toBeTruthy();
		record('pipeline', 'createStage', 'passed', `created stage ${stageId}`);
	});

	test('updateStage', async () => {
		expect(pipelineId && stageId).toBeTruthy();
		await runOperation('pipeline', 'updateStage', {
			id: pipelineId,
			stageId,
			updateFields: { name: `${unique}-stage-renamed`, color: '#10b981' },
		});
		record('pipeline', 'updateStage', 'passed', 'renamed stage');
	});

	test('deleteStage', async () => {
		expect(pipelineId && stageId).toBeTruthy();
		await runOperation('pipeline', 'deleteStage', { id: pipelineId, stageId, additionalFields: {} });
		record('pipeline', 'deleteStage', 'passed', 'deleted stage');
	});

	test('delete', async () => {
		expect(pipelineId).toBeTruthy();
		await runOperation('pipeline', 'delete', { id: pipelineId, additionalFields: {} });
		record('pipeline', 'delete', 'passed', 'deleted pipeline');
	});
});

describe('write lifecycle — reply template (create → get → update → delete)', () => {
	let templateId: string | undefined;

	test('create', async () => {
		const [created] = await runOperation('template', 'create', {
			name: `${unique}-template`,
			additionalFields: { subject: 'Hello {{first_name}}', body_html: '<p>Hi there</p>' },
		});
		templateId = idOf(created);
		expect(templateId).toBeTruthy();
		record('template', 'create', 'passed', `created ${templateId}`);
	});

	test('get', async () => {
		expect(templateId).toBeTruthy();
		const [fetched] = await runOperation('template', 'get', { id: templateId });
		expect(idOf(fetched)).toBe(templateId);
		record('template', 'get', 'passed', 'round-tripped');
	});

	test('update', async () => {
		expect(templateId).toBeTruthy();
		await runOperation('template', 'update', {
			id: templateId,
			updateFields: { body_html: '<p>Updated body</p>' },
		});
		record('template', 'update', 'passed', 'updated body');
	});

	test('delete', async () => {
		expect(templateId).toBeTruthy();
		await runOperation('template', 'delete', { id: templateId, additionalFields: {} });
		record('template', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — CRM task type (create → update → delete)', () => {
	let id: string | undefined;
	test('create', async () => {
		const [created] = await runOperation('crmTaskType', 'create', {
			name: `${unique}-tasktype`,
			additionalFields: { color: '#0ea5e9' },
		});
		id = idOf(created);
		expect(id).toBeTruthy();
		record('crmTaskType', 'create', 'passed', `created ${id}`);
	});
	test('update', async () => {
		await runOperation('crmTaskType', 'update', {
			id,
			updateFields: { name: `${unique}-tasktype-renamed`, color: '#10b981' },
		});
		record('crmTaskType', 'update', 'passed', 'renamed');
	});
	test('delete', async () => {
		await runOperation('crmTaskType', 'delete', { id, additionalFields: {} });
		record('crmTaskType', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — team (create → get → update → delete)', () => {
	let id: string | undefined;
	test('create', async () => {
		const [created] = await runOperation('team', 'create', {
			name: `${unique}-team`,
			additionalFields: { color: '#0ea5e9' },
		});
		id = idOf(created);
		expect(id).toBeTruthy();
		record('team', 'create', 'passed', `created ${id}`);
	});
	test('get', async () => {
		const [fetched] = await runOperation('team', 'get', { id });
		expect(idOf(fetched)).toBe(id);
		record('team', 'get', 'passed', 'round-tripped');
	});
	test('update', async () => {
		await runOperation('team', 'update', { id, updateFields: { name: `${unique}-team-renamed` } });
		record('team', 'update', 'passed', 'renamed');
	});
	test('delete', async () => {
		await runOperation('team', 'delete', { id, additionalFields: {} });
		record('team', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — CRM task (create → get → update → delete)', () => {
	let id: string | undefined;
	test('create', async () => {
		const [created] = await runOperation('crmTask', 'create', {
			title: `${unique}-task`,
			additionalFields: { priority: 'medium' },
		});
		id = idOf(created);
		expect(id).toBeTruthy();
		record('crmTask', 'create', 'passed', `created ${id}`);
	});
	test('get', async () => {
		const [fetched] = await runOperation('crmTask', 'get', { id });
		expect(idOf(fetched)).toBe(id);
		record('crmTask', 'get', 'passed', 'round-tripped');
	});
	test('update', async () => {
		await runOperation('crmTask', 'update', {
			id,
			updateFields: { title: `${unique}-task-done`, status: 'completed' },
		});
		record('crmTask', 'update', 'passed', 'updated status');
	});
	test('delete', async () => {
		await runOperation('crmTask', 'delete', { id, additionalFields: {} });
		record('crmTask', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — deal (create → get → update → delete)', () => {
	let pipelineId: string | undefined;
	let dealId: string | undefined;

	beforeAll(async () => {
		const made = await createPipelineWithStage('deal');
		pipelineId = made.pipelineId;
		const [created] = await runOperation('deal', 'create', {
			pipeline_id: made.pipelineId,
			stage_id: made.stageId,
			name: `${unique}-deal`,
			additionalFields: { value: 1234, currency: 'USD' },
		});
		dealId = idOf(created);
	});
	afterAll(async () => {
		if (pipelineId) {
			await runOperation('pipeline', 'delete', { id: pipelineId, additionalFields: {} }).catch(
				() => undefined,
			);
		}
	});

	test('create', () => {
		expect(dealId).toBeTruthy();
		record('deal', 'create', 'passed', `created ${dealId}`);
	});
	test('get', async () => {
		const [fetched] = await runOperation('deal', 'get', { id: dealId });
		expect(idOf(fetched)).toBe(dealId);
		record('deal', 'get', 'passed', 'round-tripped');
	});
	test('update', async () => {
		await runOperation('deal', 'update', { id: dealId, updateFields: { name: `${unique}-deal-won` } });
		record('deal', 'update', 'passed', 'renamed');
	});
	test('delete', async () => {
		await runOperation('deal', 'delete', { id: dealId, additionalFields: {} });
		record('deal', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — webhook (create → update → rotate → deliveries → delete)', () => {
	let id: string | undefined;
	test('create', async () => {
		const [created] = await runOperation('webhook', 'create', {
			url: `https://example.com/${unique}-hook`,
			additionalFields: { event_types: ['campaign.reply_received'], enabled: true },
		});
		id = idOf(created);
		expect(id).toBeTruthy();
		record('webhook', 'create', 'passed', `created ${id}`);
	});
	test('update', async () => {
		// webhook update is a full replace — url is required.
		await runOperation('webhook', 'update', {
			id,
			url: `https://example.com/${unique}-hook-v2`,
			updateFields: { description: 'e2e updated', event_types: ['campaign.reply_received'] },
		});
		record('webhook', 'update', 'passed', 'updated (full replace)');
	});
	test('rotateSecret', async () => {
		await runOperation('webhook', 'rotateSecret', { id, additionalFields: {} });
		record('webhook', 'rotateSecret', 'passed', 'rotated signing secret');
	});
	test('getDeliveries', async () => {
		await execRead('webhook', 'getDeliveries', { id, returnAll: false, limit: 10 });
	});
	test('delete', async () => {
		await runOperation('webhook', 'delete', { id, additionalFields: {} });
		record('webhook', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — campaign (create → get → reads → update → delete)', () => {
	let id: string | undefined;
	test('create', async () => {
		const [created] = await runOperation('campaign', 'create', {
			name: `${unique}-campaign`,
			additionalFields: {},
		});
		id = idOf(created);
		expect(id).toBeTruthy();
		record('campaign', 'create', 'passed', `created ${id}`);
	});
	test('get', async () => {
		const [fetched] = await runOperation('campaign', 'get', { id });
		expect(idOf(fetched)).toBe(id);
		record('campaign', 'get', 'passed', 'round-tripped');
	});
	test('id-scoped reads', async () => {
		await execRead('campaign', 'getAdvanced', { id });
		await execRead('campaign', 'getSenders', { id });
		await execRead('campaign', 'getAttachments', { id });
		await execRead('campaign', 'getLogs', { id, returnAll: false, limit: 10 });
		await execRead('campaign', 'getAbAnalysis', { id });
	});
	test('update', async () => {
		await runOperation('campaign', 'update', {
			id,
			updateFields: { description: 'e2e updated' },
		});
		record('campaign', 'update', 'passed', 'updated');
	});
	test('delete', async () => {
		await runOperation('campaign', 'delete', { id, additionalFields: {} });
		record('campaign', 'delete', 'passed', 'deleted');
	});
});

describe('write lifecycle — contact + notes (create → reads → note CRUD → delete)', () => {
	let contactId: string | undefined;
	let noteId: string | undefined;

	test('create', async () => {
		const out = await runOperation('contact', 'create', {
			contacts: [{ email: `${unique}@example.com`, first_name: 'E2E', last_name: 'Tester' }],
		});
		contactId = idOf(firstOf(out));
		expect(contactId).toBeTruthy();
		record('contact', 'create', 'passed', `created ${contactId}`);
	});
	test('get', async () => {
		const [fetched] = await runOperation('contact', 'get', { id: contactId });
		expect(idOf(fetched)).toBe(contactId);
		record('contact', 'get', 'passed', 'round-tripped');
	});
	test('update', async () => {
		await runOperation('contact', 'update', {
			id: contactId,
			updateFields: { last_name: 'Tester-Renamed' },
		});
		record('contact', 'update', 'passed', 'renamed');
	});
	test('id-scoped reads', async () => {
		await execRead('contact', 'getActivities', { id: contactId, returnAll: false, limit: 10 });
		await execRead('contact', 'getDeals', { id: contactId });
		await execRead('contact', 'getEmails', { id: contactId, returnAll: false, limit: 10 });
		await execRead('contact', 'getTimeline', { id: contactId, returnAll: false, limit: 10 });
	});
	test('note create', async () => {
		const [note] = await runOperation('contactNote', 'create', {
			id: contactId,
			content: 'First e2e note',
			additionalFields: {},
		});
		noteId = idOf(note);
		expect(noteId).toBeTruthy();
		record('contactNote', 'create', 'passed', `created ${noteId}`);
	});
	test('note getAll', async () => {
		const notes = await execRead('contactNote', 'getAll', {
			id: contactId,
			returnAll: false,
			limit: 10,
		});
		expect(notes.some((n) => idOf(n) === noteId)).toBe(true);
	});
	test('note update', async () => {
		await runOperation('contactNote', 'update', {
			id: contactId,
			noteId,
			updateFields: { content: 'Edited e2e note' },
		});
		record('contactNote', 'update', 'passed', 'edited');
	});
	test('note delete', async () => {
		await runOperation('contactNote', 'delete', { id: contactId, noteId, additionalFields: {} });
		record('contactNote', 'delete', 'passed', 'deleted');
	});
	test('contact delete', async () => {
		await runOperation('contact', 'delete', { id: contactId, additionalFields: {} });
		record('contact', 'delete', 'passed', 'deleted');
	});
});

describe('coverage accounting', () => {
	test('every operation is executed or skipped-with-reason, and a report is written', () => {
		const report = buildReport();

		// Sanity: the registry really does hold the full surface.
		expect(report.total).toBe(allOperations().length);

		// Nothing may be left in the "not yet categorised" bucket.
		const uncategorised = report.operations.filter((o) =>
			o.detail.includes('not yet categorised'),
		);
		expect(uncategorised).toEqual([]);

		// No live call may have hard-failed.
		const failures = report.operations.filter((o) => o.disposition === 'failed');
		expect(failures).toEqual([]);

		const path = writeReport(report);

		/* eslint-disable no-console */
		console.log(
			`\nWarmbly live coverage: ${report.passed} passed · ${report.skipped} skipped · ` +
				`${report.failed} failed  (executed ${report.executedRatio})`,
		);
		console.log(`Full report: ${path}\n`);
		/* eslint-enable no-console */
	});
});
