<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/warmbly-mark-white.svg" />
    <img src="assets/warmbly-mark-dark.svg" alt="Warmbly" width="76" height="76" />
  </picture>
</p>

<p align="center">
  <strong>n8n-nodes-warmbly</strong><br />
  The community n8n node for Warmbly: cold email, mailbox warmup, unibox,<br />
  CRM and deliverability, automated from your workflows. Your keys, your data.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-warmbly"><img src="https://img.shields.io/npm/v/n8n-nodes-warmbly?style=flat-square&labelColor=1f2937&color=475569" alt="npm version" /></a>
  &nbsp;<img src="https://img.shields.io/badge/n8n-community%20node-475569?style=flat-square&labelColor=1f2937" alt="n8n community node" />
  &nbsp;<a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-475569?style=flat-square&labelColor=1f2937" alt="License: MIT" /></a>
  &nbsp;<img src="https://img.shields.io/badge/Self--hostable-yes-475569?style=flat-square&labelColor=1f2937" alt="Self-hostable" />
</p>

<p align="center">
  <a href="#what-this-is">What this is</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#credentials">Credentials</a> ·
  <a href="#nodes">Nodes</a> ·
  <a href="#operations">Operations</a> ·
  <a href="#triggers">Triggers</a> ·
  <a href="#examples">Examples</a>
</p>

---

## What this is

[Warmbly](https://warmbly.com) is an open-source cold-outreach and mailbox-warmup
platform you can self-host. This package puts the whole Warmbly API inside
[n8n](https://n8n.io), so the outbound machine that sends, warms, and tracks your
mail can also be wired to everything else you run, without writing a line of
HTTP plumbing.

It ships two nodes:

- **Warmbly** is an action node covering **305 operations across 36 resources**:
  campaigns and sequences, mailboxes and warmup, the unibox, contacts, segments
  and suppressions, hosted forms, CRM, analytics, the deliverability advisor,
  lead sync, meetings, integrations, automations, webhooks, OAuth applications
  and the agent tool registry.
- **Warmbly Trigger** is a webhook trigger that starts a workflow the moment a
  Warmbly event fires (a reply lands, a meeting is booked, a mailbox is
  quarantined, a deal moves stage), with the delivery signature verified for you.

Because Warmbly self-hosts, so does this node: point the credential's base URL at
Warmbly Cloud or at your own instance and everything else is identical.

## Installation

### From the n8n UI (recommended)

On self-hosted n8n, open **Settings → Community Nodes → Install**, enter the
package name, and confirm:

```
n8n-nodes-warmbly
```

The **Warmbly** and **Warmbly Trigger** nodes appear in the node panel right
after install.

### Manually

```bash
# in your n8n installation / custom extensions directory
npm install n8n-nodes-warmbly
```

Then restart n8n. See the n8n docs on
[community nodes](https://docs.n8n.io/integrations/community-nodes/installation/)
for the manual and Docker paths.

**Compatibility:** built against the n8n nodes API (`n8nNodesApiVersion: 1`) and
verified on Node.js 20+. The action node is also exposed to n8n AI Agents as a
tool.

## Credentials

You authenticate with a Warmbly **API key**. Create one in the dashboard under
**Settings → API keys**, granting it only the scopes the workflow needs; the
key inherits exactly those permissions.

In n8n, create a **Warmbly API** credential:

| Field | Description |
|-------|-------------|
| **API Key** | Your key, starting with `wmbly_`. Stored encrypted by n8n and sent as a Bearer token. |
| **Base URL** | `https://api.warmbly.com/v1` for Warmbly Cloud, or your own instance, e.g. `https://api.yourdomain.com/v1`. |

The credential's **Test** button calls a lightweight authenticated endpoint, so
you get a green check the moment the key and base URL are right. Requests are
rate-limited per key; the node surfaces `X-RateLimit-*` headers and respects the
API's idempotency support on write operations.

Full reference: [docs.warmbly.com/api/authentication](https://docs.warmbly.com/api/authentication).

## Nodes

### Warmbly (action)

Pick a **Resource**, then an **Operation**. Required inputs are first-class
fields; everything optional lives under **Additional Fields** / **Update Fields**
/ **Filters** so the form stays readable. The node handles the mechanics for you:

- **Pagination**: list operations expose **Return All** (it follows the opaque
  `next_cursor` to the end) or a **Limit**.
- **Idempotency**: write operations accept an **Idempotency Key** so a retried
  step never acts twice.
- **File uploads**: campaign attachments, contact CSV/XLSX imports, form assets
  and application logos stream a binary input field as multipart form data.
- **Reliability**: honours *Continue On Fail* and attaches `pairedItem` so
  outputs map back to their inputs.

### Warmbly Trigger

Registers a Warmbly webhook endpoint when the workflow activates, answers the
ownership-verification challenge automatically, and removes the endpoint on
deactivation. Every delivery's `X-Warmbly-Signature` (HMAC-SHA256 over the raw
body) is verified against the signing secret before the workflow runs, so spoofed
calls never reach your logic.

## Operations

<details>
<summary><strong>All 305 operations, by resource</strong></summary>

| Resource | # | Operations |
|----------|---|------------|
| **Advisor** | 9 | Apply Finding, Dismiss Finding, Get Many, Get Settings, Get Summary, Refresh, Snooze Finding, Submit Feedback, Undo Finding |
| **Agent Tool** | 2 | Call, Get Many |
| **AI Skill** | 4 | Create, Delete, Get Many, Update |
| **Analytics** | 10 | Compare Campaigns, Get Account, Get Accounts, Get Campaign, Get Campaign Daily Stats, Get Campaign Hourly Stats, Get Dashboard, Get Deliverability, Get Usage, Get Warmup |
| **API Key** | 11 | Create, Get, Get Analytics, Get Logs, Get Many, Get Permissions, Get Usage Analytics, Get Usage Summary, Revoke, Revoke Own Key, Update |
| **Audit Log** | 1 | Get Many |
| **Automation** | 8 | Create, Delete, Get, Get Many, Get Runs, Test, Update, Update Layout |
| **Campaign** | 30 | Create, Delete, Delete Attachment, Duplicate, Estimate, Generate AI Variable, Generate Edit, Generate Writing, Get, Get A/B Analysis, Get Advanced Settings, Get Attachments, Get Forms, Get Logs, Get Many, Get Overview, Get Segments, Get Senders, Preview Template, Replace Segments, Replace Senders, Run Preflight, Send Test Email, Start, Stop, Update, Update Advanced Settings, Update Step Layout, Upload Attachment, Verify Tracking Domain |
| **Campaign A/B Variant** | 4 | Create, Delete, Get Many, Update |
| **Campaign Folder** | 4 | Create, Delete, Move, Update |
| **Campaign Step** | 4 | Create, Delete, Get Many, Update |
| **Contact** | 23 | Bulk Delete, Bulk Update, Commit Import, Create, Delete, Export, Get, Get Activities, Get Campaigns, Get Custom Fields, Get Deals, Get Emails, Get Research, Get Segments, Get Timeline, Get Verification, Look Up by Email, Preview Import, Request Verification, Research, Research Many, Search, Update |
| **Contact Category** | 4 | Create, Delete, Move, Update |
| **Contact Note** | 4 | Create, Delete, Get Many, Update |
| **CRM Task** | 7 | Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **CRM Task Type** | 4 | Create, Delete, Get Many, Update |
| **Dead Letter** | 2 | Get Many, Replay |
| **Deal** | 7 | Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **Deliverability** | 1 | Ingest Event |
| **Form** | 15 | Create, Delete, Delete Asset, Delete Submission, Get, Get Config, Get Domain, Get Many, Get Prefilled Link, Get Stats, Get Submissions, Set Domain, Update, Upload Asset, Verify Domain |
| **Integration** | 16 | Create, Create Event Subscription, Delete, Delete Event Subscription, Get, Get Bookings, Get Catalog, Get Event Subscriptions, Get Field Mappings, Get Many, Get Sync Runs, Get Webhook Secret, Push Contacts, Replace Field Mappings, Test Connection, Update Config |
| **Lead Sync Source** | 9 | Create, Delete, Get, Get Google Connection, Get Google Spreadsheet, Get Many, Preview Google Sheet, Sync Now, Update |
| **Mailbox** | 25 | Bulk Tag, Check Domain Authentication, Delete, Get, Get Allowance, Get Behavior, Get Behavior Plan, Get Many, Get Sync Status, Get Tracking Domain, Get Warmup Ban Status, Hold Sending, Pause Warmup, Refresh Auth Check, Release Sending, Resume Warmup, Send Email, Start Warmup, Stop Warmup, Submit Warmup Appeal, Update, Update Behavior, Update Tracking Domain, Verify Address, Verify Tracking Domain |
| **Mailbox Tag** | 4 | Create, Delete, Move, Update |
| **Meeting** | 4 | Create, Delete, Get Many, Get Summary |
| **OAuth Application** | 11 | Create, Delete, Get, Get Many, Get Webhook Deliveries, Get Webhook Endpoints, Get Webhook Secret, Rotate Secret, Rotate Webhook Secret, Update, Upload Logo |
| **Outreach Settings** | 2 | Get Settings, Update Settings |
| **Pipeline** | 8 | Create, Create Stage, Delete, Delete Stage, Get, Get Many, Update, Update Stage |
| **Reply Template** | 9 | Create, Delete, Duplicate, Get, Get Many, Render, Reorder, Score Content, Update |
| **Segment** | 11 | Add to Campaign, Create, Delete, Get, Get Fields, Get Many, Get Overrides, Look Up Members, Preview, Set Members, Update |
| **Suppression** | 3 | Add, Get Many, Remove |
| **Team** | 7 | Add Member, Create, Delete, Get, Get Many, Remove Member, Update |
| **Unibox** | 24 | Approve Agent Draft, Cancel Scheduled Send, Compose, Delete Draft, Discard Agent Draft, Draft Compose, Draft Reply, Get Agent Drafts, Get Compose Candidates, Get Drafts, Get Many, Get Message, Get Overview, Get Scheduled Sends, Get Snoozes, Get Thread, Get Thread Labels, Get Unseen Count, Mark Seen, Reply, Save Draft, Set Thread Labels, Snooze, Unsnooze |
| **Warmup Routing Rule** | 4 | Create, Delete, Get Many, Update |
| **Webhook** | 11 | Create, Delete, Get All Deliveries, Get Deliveries, Get Event Types, Get Many, Get Throttle Drops, Redeliver, Rotate Secret, Update, Verify Endpoint |
| **Workspace** | 3 | Get Identity, Get Plans, Get Timezones |

</details>

## Triggers

The Warmbly Trigger can fire on **62 event types**. Leave **Events** empty to
receive every event except the high-volume (firehose) ones, or pick exactly what
you need. A few of the most useful:

| Category | Events |
|----------|--------|
| **Campaign** | `campaign.reply_received`, `campaign.completed`, `campaign.email_bounced`, `campaign.deliverability_warning`, `campaign.unsubscribed` |
| **Inbox** | `inbox.reply_received`, `inbox.email_received` *(firehose)* |
| **Warmup** | `warmup.health_changed`, `warmup.placement_in_spam`, `warmup.quarantined`, `warmup.blocked` |
| **Mailbox** | `email_account.connected`, `email_account.error`, `email_account.health_changed` |
| **Meeting** | `meeting.booked`, `meeting.rescheduled`, `meeting.canceled` |
| **Contact / CRM** | `contact.created`, `crm.deal_updated`, `crm.task_created` |
| **Deliverability** | `deliverability.bounce`, `deliverability.complaint` |

Firehose events (per-message sends, opens, clicks, syncs) must be selected
explicitly; they are never included in the "all events" default. See the
[webhooks guide](https://docs.warmbly.com/guides/webhooks).

## Examples

**Slack alert when a prospect replies**

```
Warmbly Trigger (campaign.reply_received)  →  Slack (Send Message)
```

**Daily warmup health digest**

```
Schedule  →  Warmbly: Analytics → Get Warmup  →  format  →  Email/Slack
```

**Sync new signups into a campaign**

```
Webhook / CRM Trigger  →  Warmbly: Contact → Create  →  Warmbly: Campaign → Start
```

**Book → deal**

```
Warmbly Trigger (meeting.booked)  →  Warmbly: Deal → Create (pipeline + stage from dropdowns)
```

## Resources

- [Warmbly](https://warmbly.com) · [Documentation](https://docs.warmbly.com) · [API reference](https://docs.warmbly.com/api)
- [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/)
- Found a bug? [Open an issue](https://github.com/warmbly/n8n-nodes-warmbly/issues).

## Development

```bash
npm install
npm run build      # compile TypeScript + copy icons into dist/
npm run lint       # eslint (n8n community-node ruleset)
npm test           # fast unit tests (signature verification, parsing, API coverage)
npm run test:e2e   # live integration suite against a running Warmbly
```

### The node is generated

The resource descriptions, the operation registry and the trigger's event list
are generated from Warmbly's own source, not hand-maintained, so a new endpoint
cannot quietly go missing:

```bash
# 1. Record what the API serves (needs a Warmbly checkout; default ~/projects/warmbly)
WARMBLY_REPO=~/projects/warmbly npm run api:sync

# 2. Regenerate the node from that recording
npm run generate
```

`api:sync` reads the gin route table, the handlers and the request structs, and
writes [`spec/warmbly-api.json`](./spec/warmbly-api.json) (every operation an API
key can reach) and `spec/warmbly-events.json`. `generate` turns those, plus the
editorial layer in [`spec/node-overlay.json`](./spec/node-overlay.json) (display
names, prose) and the route naming in `spec/node-mapping.json`, into
`nodes/Warmbly/`. Editing a generated file directly is undone by the next run;
edit the overlay instead. CI runs `npm run generate` and fails on any diff, and
`npm test` asserts the registry and the recorded surface still agree.

The end-to-end suite drives the real node against a running Warmbly instance
(`cd ~/warmbly && make infra && make seed && make run`), smoke-testing every
read endpoint and running full create → update → delete lifecycles, then writes
a coverage report. Details in [`test/README.md`](./test/README.md).

### Publishing

Releases publish to npm automatically via **OIDC trusted publishing** (no
`NPM_TOKEN`, provenance attached) whenever a GitHub Release is cut. To ship a
version, bump `version` in `package.json`, push, and cut the Release. The
workflow lives in [`.github/workflows/publish.yml`](./.github/workflows/publish.yml).

## License

[MIT](./LICENSE) © Warmbly. Not affiliated with n8n GmbH.
