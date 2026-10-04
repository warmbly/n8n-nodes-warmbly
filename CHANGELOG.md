# Changelog

All notable changes to `n8n-nodes-warmbly` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-10-04

Catches the node up with the current Warmbly API (305 -> 354 operations).

### Changed

- **Breaking:** the campaign `Kind` filter on Get Many and the `Kind` field on
  Create are gone, because the API no longer takes them. Remove them from saved
  workflows.
- Contact Look Up by Email now also accepts a thread ID and a mailbox ID, and
  the email is optional when a thread ID is given.
- New parameters on existing operations: campaign entry delay, step kind,
  action and thread reply, estimate window, mailbox send-as address and warmup
  placement, contact selection by filter for verification, bulk edit and segment
  membership, unibox forward, thread-ID snooze and mark seen, archived and
  automated inbox filters, analytics date range and mailbox filter, lead sync
  segment filter, form triage, and more.

### Added

- **49 new operations (305 -> 354) across 5 new resources**:
  - Contact Import: create from a file, analyze, start, save draft, cancel, get,
    get many and download failed rows.
  - Placement Test, Placement Batch and Placement Seed: run and follow inbox
    placement tests, preview and run batches, and choose seed mailboxes.
  - Email Image: upload, list and delete.
  - Campaign: per-lead hold (pause, resume, get), per-lead CC contacts, placement
    monitor, and today's send plan.
  - Mailbox: send identity (get, refresh), direct-mail tracking and sync
    folders. Analytics: direct mail, inbox tagging review and warmup placement.
  - CRM Task bulk update and delete, API key permanent delete, integration
    inbound URL rotation and signing key, template content analysis, and unibox
    move folder.
- No new trigger events (62 event types).

### Fixed

- The API extractor handles route registrations that span several lines,
  request bodies seeded with defaults, and handlers that accept either a list or
  a selection object.

## [0.2.0] - 2026-09-07

Full coverage of the current Warmbly API, and the node is now generated from
Warmbly's own source so it stays that way.

### Added

- **126 new operations (179 → 305) across 12 new resources**: segments, the
  workspace suppression list, hosted forms, the deliverability advisor, lead-sync
  sources, meetings, OAuth applications, AI skills, the agent tool registry,
  campaign folders, mailbox tags and contact categories.
- New operations on existing resources: campaign duplicate / estimate / overview
  / segments / step layout and the AI writing helpers; contact custom fields,
  research, verification, segment and campaign membership; mailbox allowance,
  sending behaviour, hold and release, bulk tagging, tracking-domain and sync
  reads; unibox compose, drafts and agent drafts; webhook delivery listing,
  redelivery, endpoint verification and the event-type catalog; automation
  layout; API key self-revocation.
- New parameters the API had gained: campaign guardrails, UTM tracking,
  continuous mode, unsubscribe mode and `steps`; contact search by engagement,
  lead status, segment and verification status; unibox filters (folder,
  direction, address, agent drafts); mailbox timezone and save-to-sent; webhook
  delivery filters; and more.
- **One webhook trigger event**: `form.submitted` (62 event types in total).
- **Generation pipeline**: `npm run api:sync` records the API surface from a
  Warmbly checkout into `spec/`, `npm run generate` rebuilds the registry,
  descriptions and event list from it. CI fails if the committed node and the
  recorded surface disagree, and a unit test asserts every served operation is
  reachable and every registry field has a UI field to come from.

### Fixed

- Multipart responses are no longer force-unwrapped: an upload that answers with
  a single object (the contact import preview) returned the first array it found
  inside it (the column list) instead of the preview.
- `POST`/`PUT`/`PATCH` operations with nothing filled in now send an empty JSON
  body instead of no body at all, which several endpoints reject.
- Pagination is now applied where the API paginates: contact timeline and webhook
  deliveries follow the cursor via **Return All** instead of a bare limit.
- List detection corrected for 11 operations that were returning their envelope
  as one item (integrations, automations, plans, API key permissions) or
  splitting a single object into rows (analytics usage, webhook update).
- Every write operation now offers **Idempotency Key**; twelve were missing it.
- Field types corrected against the API: webhook `event_types` is a list, and
  enum-valued fields render as dropdowns from the server's own value set.

### Removed

- `Campaign → Create`'s `sequences` field and `Campaign Step → Create`'s `body`
  field: the API accepts neither (campaign create takes `steps`; step create
  takes no body at all).

[0.2.0]: https://github.com/warmbly/n8n-nodes-warmbly/releases/tag/v0.2.0

## [0.1.0] - 2026-06-15

Initial release.

### Added

- **Warmbly** action node covering 179 operations across 24 resources:
  campaigns, campaign steps and A/B variants, mailboxes and warmup, contacts
  and contact notes, the unibox, CRM pipelines/deals/tasks/task types, reply
  templates, analytics, audit logs, API keys, integrations, automations,
  webhooks, warmup routing, outreach settings, deliverability ingestion, the
  task dead-letter queue, teams, plans and timezones.
  - Cursor pagination with **Return All** / **Limit** on list operations.
  - **Idempotency Key** support on write operations.
  - Multipart file upload for campaign attachments and contact CSV/XLSX import.
  - Dynamic dropdowns for CRM pipelines and stages.
  - Exposed to n8n AI Agents as a tool; honours *Continue On Fail* and
    `pairedItem`.
- **Warmbly Trigger** node listening on 61 event types via signed webhooks.
  - Registers and removes its Warmbly webhook endpoint with the workflow.
  - Answers the endpoint-verification challenge automatically.
  - Verifies the `X-Warmbly-Signature` HMAC-SHA256 over the raw body.
- **Warmbly API** credential with a configurable base URL for Warmbly Cloud or
  any self-hosted instance, Bearer-token auth, and a connection test.

[0.1.0]: https://github.com/warmbly/n8n-nodes-warmbly/releases/tag/v0.1.0
