# Changelog

All notable changes to `n8n-nodes-warmbly` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/).

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
