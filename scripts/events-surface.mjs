#!/usr/bin/env node
/**
 * Record Warmbly's outbound webhook event catalog
 * (`internal/models/webhook.go`) as `spec/warmbly-events.json`, so the
 * trigger's event list is the server's list rather than a copy that quietly
 * ages. `scripts/generate-node.mjs` turns the record into node source.
 *
 *   WARMBLY_REPO=~/projects/warmbly node scripts/events-surface.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

const REPO = resolve(process.env.WARMBLY_REPO || join(homedir(), 'projects', 'warmbly'));
const CATALOG = join(REPO, 'internal/models/webhook.go');
if (!existsSync(CATALOG)) {
	console.error(`No Warmbly checkout at ${REPO}. Set WARMBLY_REPO.`);
	process.exit(1);
}

const src = readFileSync(CATALOG, 'utf8');

/** Constant name -> wire value, for both event types and category labels. */
const values = new Map();
for (const m of src.matchAll(/^\t(\w+)\s+(?:WebhookEventType|WebhookEventCategory)\s*=\s*"([^"]*)"$/gm)) {
	values.set(m[1], m[2]);
}

const firehose = new Set();
const firehoseBlock = /var firehoseEvents = map\[WebhookEventType\]bool\{([\s\S]*?)\n\}/.exec(src);
for (const m of (firehoseBlock?.[1] ?? '').matchAll(/^\t(\w+):\s*true,$/gm)) {
	firehose.add(m[1]);
}

const rowsBlock = /rows := \[\]row\{([\s\S]*?)\n\t\}/.exec(src);
if (!rowsBlock) {
	console.error('Could not find the event catalog rows in internal/models/webhook.go');
	process.exit(1);
}

const events = [];
for (const m of rowsBlock[1].matchAll(/^\t\t\{(\w+), (\w+), "((?:[^"\\]|\\.)*)"\},$/gm)) {
	const [, typeConst, categoryConst, description] = m;
	const type = values.get(typeConst);
	const category = values.get(categoryConst);
	if (!type || !category) {
		console.error(`Unresolved catalog row: ${typeConst} / ${categoryConst}`);
		process.exit(1);
	}
	events.push({
		type,
		category,
		description: description.replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
		firehose: firehose.has(typeConst),
	});
}

const words = (text) =>
	text
		.split(/[._\s]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

const squash = (text) => text.toLowerCase().replace(/[^a-z]/g, '');

/**
 * `campaign.email_sent` under the Campaign category reads `Email Sent`: the
 * first segment is dropped only when the category already says it. An event
 * filed under another category keeps it, so `form.submitted` under Contact
 * stays `Form Submitted` rather than the bare `Submitted`.
 */
const CATEGORY_ALIASES = new Map([['email_account', 'mailbox']]);

function label(type, category) {
	const [head, ...rest] = type.split('.');
	const alias = CATEGORY_ALIASES.get(head) ?? head;
	const covered = squash(category).startsWith(squash(alias));
	return words((covered ? rest : [head, ...rest]).join('.'));
}

const options = events
	.map((event) => ({
		name: `${words(event.category)}: ${label(event.type, event.category)}`,
		value: event.type,
		description: event.firehose
			? `${event.description} High-volume event; subscribe to it explicitly.`
			: event.description,
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(
	join(process.cwd(), 'spec', 'warmbly-events.json'),
	JSON.stringify({ eventCount: options.length, events: options }, null, '\t') + '\n',
);

console.log(
	`${options.length} webhook events (${events.filter((e) => e.firehose).length} firehose) ` +
		'-> spec/warmbly-events.json',
);
