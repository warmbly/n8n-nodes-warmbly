# Changelog

All notable changes to `n8n-nodes-warmbly` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-10-25

Catches the node up with the Warmbly API (server range `b32a2877..ec3e1df78`).
Operations: 305 → 413 across 52 resources (was 36).

### Breaking

- **Contact → Bulk Delete**: the `Contact IDs` field is replaced by `Contacts`
  (IDs), plus `All`, `Filters` and `Exclude` to delete every contact matching a
  search.
- **Campaign → Create / Get Many**: the `Kind` field is gone; one-time
  campaigns no longer exist in the API.
- **Contact → Research Many**: `Contact IDs` moved from the main fields into
  Additional Fields, since a search selection can be used instead.
- **Campaign Folder, Mailbox Tag and Contact Category → Create / Move**: `Title`
  and `Position` are now required and sit at the top of the form instead of in
  Additional Fields or Update Fields.

### Added

- **108 new operations on 16 new resources**: Campaign Lead (CC, hold, pause,
  resume), Placement Monitor, Contact Import (create, analyze, start, cancel,
  failures), CRM (backfill, sync health, lists, owners, settings, metadata),
  CRM Contact, Email Image, Apollo (overview, lists, key, enrichments, import
  sources), Salesforce (overview, settings, activity, import sources, users,
  list views), Clay settings, Community Apps, and Inbox Placement (overview,
  coverage, seeds, tests, batches).
- New operations on existing resources: analytics (direct mail, inbox tagging,
  warmup placement), API key permanent delete, campaign send plan, contact
  Salesforce links, CRM task bulk update and delete, mailbox certificates,
  send identity, direct tracking and sync settings, OAuth application listing
  and logo, integration inbound URL rotation and signing key, reply template
  analysis, and unibox move to folder.
- New fields on existing operations, including campaign entry delay and
  estimate inputs, campaign step content and conditions, contact search by mail
  host, selections (`All`, `Filters`, `Exclude`) on bulk contact and segment
  operations, mailbox sending and warmup settings, lead-sync segments, unibox
  filters, and form triage.
- Secret fields (API keys, signing keys, auth tokens) are masked in the editor.

### Fixed

- The generator now reads handlers that accept several body shapes, request
  structs seeded with defaults, and route registrations split over several
  lines, so Contact → Create / Bulk Delete, Contact → Look Up by Email and
  Outreach settings keep their fields.

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

[0.3.0]: https://github.com/warmbly/n8n-nodes-warmbly/releases/tag/v0.3.0
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
