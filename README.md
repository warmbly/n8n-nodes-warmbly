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

- **Warmbly** is an action node covering **520 operations across 62 resources**:
  campaigns and sequences, mailboxes and warmup, the unibox, contacts, segments
  and suppressions, hosted forms, the lead finder, CRM, analytics, the
  deliverability advisor, inbox placement, client reports, the domain and
  mailbox store, lead sync, meetings, integrations, automations, webhooks,
  OAuth applications and the agent tool registry.
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
<summary><strong>All 520 operations, by resource</strong></summary>

| Resource | # | Operations |
|----------|---|------------|
| **Advisor** | 9 | Apply Finding, Dismiss Finding, Get Many, Get Settings, Get Summary, Refresh, Snooze Finding, Submit Feedback, Undo Finding |
| **Agent Tool** | 2 | Call, Get Many |
| **AI Skill** | 4 | Create, Delete, Get Many, Update |
| **Analytics** | 13 | Compare Campaigns, Get Account, Get Accounts, Get Campaign, Get Campaign Daily Stats, Get Campaign Hourly Stats, Get Dashboard, Get Deliverability, Get Direct Mail, Get Inbox Tagging Review, Get Usage, Get Warmup, Get Warmup Placement |
| **API Key** | 12 | Create, Delete Permanently, Get, Get Analytics, Get Logs, Get Many, Get Permissions, Get Usage Analytics, Get Usage Summary, Revoke, Revoke Own Key, Update |
| **Apollo** | 12 | Create Import Source, Delete Import Source, Get Enrichment, Get Enrichments, Get Import Sources, Get Lists, Get Overview, Preview Import, Replace Key, Run Import Source, Start Enrichment, Update Import Source |
| **Audit Log** | 1 | Get Many |
| **Automation** | 8 | Create, Delete, Get, Get Many, Get Runs, Test, Update, Update Layout |
| **Campaign** | 34 | Copy to Workspaces, Create, Delete, Delete Attachment, Duplicate, Estimate, Generate AI Variable, Generate Edit, Generate Writing, Get, Get A/B Analysis, Get Advanced Settings, Get Attachments, Get Forms, Get Lead Timezones, Get Logs, Get Many, Get Overview, Get Segments, Get Send Plan, Get Senders, Get Warmup Placement, Preview Template, Replace Segments, Replace Senders, Run Preflight, Send Test Email, Start, Stop, Update, Update Advanced Settings, Update Step Layout, Upload Attachment, Verify Tracking Domain |
| **Campaign A/B Variant** | 4 | Create, Delete, Get Many, Update |
| **Campaign Folder** | 4 | Create, Delete, Move, Update |
| **Campaign Lead** | 10 | Delete Email, Get CC, Get Emails, Get Hold, Pause, Resume, Set CC, Set Email, Suggest CC, Write Email With AI |
| **Campaign Review** | 6 | Approve Leads, Get, Get Leads, Reopen Leads, Turn On or Off, Write AI Copy |
| **Campaign Step** | 4 | Create, Delete, Get Many, Update |
| **Client Connect Link** | 4 | Create, Get Many, Get Uses, Revoke |
| **Client Report** | 10 | Create, Create Share Link, Delete, Delete Schedule, Get, Get Many, Preview, Revoke Share Link, Set Schedule, Update |
| **Contact** | 26 | Bulk Delete, Bulk Update, Commit Import, Create, Delete, Export, Get, Get Activities, Get Campaigns, Get Custom Fields, Get Deals, Get Emails, Get Research, Get Salesforce, Get Segments, Get Timeline, Get Verification, Look Up by Email, Preview Import, Request Verification, Research, Research Many, Search, Sync Salesforce, Unlink Salesforce, Update |
| **Contact Category** | 4 | Create, Delete, Move, Update |
| **Contact Import** | 8 | Analyze, Cancel, Create, Download Failures, Get, Get Many, Save Draft, Start |
| **Contact Note** | 4 | Create, Delete, Get Many, Update |
| **CRM** | 14 | Discard Sync Failures, Get Backfill, Get Lists, Get Metadata, Get Owners, Get Settings, Get Sync Health, Import List, Map Owner, Preview Import, Retry Sync Failures, Start Backfill, Sync Now, Update Settings |
| **CRM Contact** | 4 | Get, Link, Refresh, Update |
| **CRM Task** | 9 | Bulk Delete, Bulk Update, Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **CRM Task Type** | 4 | Create, Delete, Get Many, Update |
| **Dead Letter** | 2 | Get Many, Replay |
| **Deal** | 7 | Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **Deliverability** | 1 | Ingest Event |
| **Email Image** | 3 | Delete, Get Many, Upload |
| **Form** | 15 | Create, Delete, Delete Asset, Delete Submission, Get, Get Config, Get Domain, Get Many, Get Prefilled Link, Get Stats, Get Submissions, Set Domain, Update, Upload Asset, Verify Domain |
| **Integration** | 22 | Create, Create Event Subscription, Delete, Delete Event Subscription, Get, Get Bookings, Get Catalog, Get Clay Settings, Get Community App, Get Community Apps, Get Event Subscriptions, Get Field Mappings, Get Many, Get Sync Runs, Get Webhook Secret, Push Contacts, Replace Field Mappings, Rotate Inbound URL, Set Signing Key, Test Connection, Update Clay Settings, Update Config |
| **Lead** | 13 | Add To Contacts, Bulk Delete, Bulk Update, Enrich, Export, Geocode, Get, Get Config, Get Facets, Get Points, Query, Search, Update |
| **Lead Enrichment** | 2 | Get, Get Many |
| **Lead Person** | 4 | Add, Delete, Find Email, Update |
| **Lead Search** | 3 | Delete, Get Many, Update |
| **Lead Sync Source** | 9 | Create, Delete, Get, Get Google Connection, Get Google Spreadsheet, Get Many, Preview Google Sheet, Sync Now, Update |
| **Mailbox** | 42 | Bulk Delete, Bulk Set Status, Bulk Tag, Bulk Warmup, Check Domain Authentication, Clear Warmup Filter Tag, Connect Many via OAuth, Connect Many via SMTP/IMAP, Connect via OAuth, Connect via SMTP/IMAP, Delete, Get, Get Allowance, Get Behavior, Get Behavior Plan, Get Certificates, Get Many, Get Partner Enablement, Get Send Identity, Get Sync Status, Get Tracking Domain, Get Warmup Ban Status, Get Warmup Filter Tag, Hold Sending, Pause Warmup, Refresh Auth Check, Refresh Send Identity, Release Sending, Resume Sending, Resume Warmup, Send Email, Set Warmup Filter Tag, Start Warmup, Stop Warmup, Submit Warmup Appeal, Update, Update Behavior, Update Direct Tracking, Update Sync, Update Tracking Domain, Verify Address, Verify Tracking Domain |
| **Mailbox OAuth App** | 3 | Delete, Get Many, Set |
| **Mailbox Sign-In Link** | 4 | Create, Get, Get Many, Revoke |
| **Mailbox Tag** | 4 | Create, Delete, Move, Update |
| **Meeting** | 4 | Create, Delete, Get Many, Get Summary |
| **OAuth Application** | 16 | Create, Delete, Delete Listing, Delete Logo, Get, Get Listing, Get Many, Get Webhook Deliveries, Get Webhook Endpoints, Get Webhook Secret, Rotate Secret, Rotate Webhook Secret, Set Listing, Update, Upload Application Logo, Upload Logo |
| **Outreach Settings** | 2 | Get Settings, Update Settings |
| **Pipeline** | 8 | Create, Create Stage, Delete, Delete Stage, Get, Get Many, Update, Update Stage |
| **Placement** | 4 | Get Coverage, Get Overview, Get Seeds, Set Seed |
| **Placement Batch** | 6 | Cancel, Create, Get, Get Many, Get Senders, Preview |
| **Placement Monitor** | 3 | Delete, Get, Set |
| **Placement Test** | 4 | Cancel, Create, Get, Get Many |
| **Reply Template** | 11 | Analyze, Copy to Workspaces, Create, Delete, Duplicate, Get, Get Many, Render, Reorder, Score Content, Update |
| **Salesforce** | 16 | Create Import Source, Delete Import Source, Get Activity, Get Campaigns, Get Import Sources, Get List Views, Get Metadata, Get Overview, Get Settings, Get Users, Preview Import, Retry Activity, Run Import Source, Sync Now, Update Import Source, Update Settings |
| **Segment** | 11 | Add to Campaign, Create, Delete, Get, Get Fields, Get Many, Get Overrides, Look Up Members, Preview, Set Members, Update |
| **Store** | 5 | Create Quote, Get Photo, Get Status, Set Registrant, Upload Photo |
| **Store DNS Record** | 4 | Check, Create, Delete, Update |
| **Store Domain** | 11 | Check Connection, Connect, Get, Get Many, Regenerate Connection, Remove, Renew, Search, Start Microsoft Consent, Transfer Out, Update |
| **Store Mailbox** | 6 | Cancel, Get Many, Get Sign-In, Resume, Set Photo, Update |
| **Store Order** | 3 | Create, Get, Get Many |
| **Suppression** | 3 | Add, Get Many, Remove |
| **Team** | 7 | Add Member, Create, Delete, Get, Get Many, Remove Member, Update |
| **Tool Migration** | 8 | Cancel, Create, Dismiss, Get, Get Many, Get Providers, Link Senders, Start |
| **Unibox** | 26 | Approve Agent Draft, Cancel Scheduled Send, Compose, Delete Draft, Discard Agent Draft, Draft Compose, Draft Reply, Get Agent Drafts, Get Compose Candidates, Get Drafts, Get Many, Get Message, Get Overview, Get Scheduled Sends, Get Snoozes, Get Thread, Get Thread Labels, Get Unseen Count, Mark Seen, Move Folder, Reply, Save Draft, Set Thread Labels, Snooze, Unsnooze, Upsert Thread Draft |
| **Warmup Routing Rule** | 4 | Create, Delete, Get Many, Update |
| **Webhook** | 11 | Create, Delete, Get All Deliveries, Get Deliveries, Get Event Types, Get Many, Get Throttle Drops, Redeliver, Rotate Secret, Update, Verify Endpoint |
| **Workspace** | 3 | Get Identity, Get Plans, Get Timezones |

</details>

## Triggers

The Warmbly Trigger can fire on **65 event types**. Leave **Events** empty to
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
