<p align="center">
  <img src="assets/warmbly-mark.svg" alt="Warmbly" width="76" height="76" />
</p>

<p align="center">
  <strong>n8n-nodes-warmbly</strong><br />
  The community n8n node for Warmbly — cold email, mailbox warmup, unibox,<br />
  CRM and deliverability, automated from your workflows. Your keys, your data.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-warmbly"><img src="https://img.shields.io/npm/v/n8n-nodes-warmbly?style=flat-square&labelColor=0c4a6e&color=0ea5e9" alt="npm version" /></a>
  &nbsp;<img src="https://img.shields.io/badge/n8n-community%20node-0ea5e9?style=flat-square&labelColor=0c4a6e" alt="n8n community node" />
  &nbsp;<a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-10b981?style=flat-square&labelColor=0c4a6e" alt="License: MIT" /></a>
  &nbsp;<img src="https://img.shields.io/badge/Self--hostable-yes-38bdf8?style=flat-square&labelColor=0c4a6e" alt="Self-hostable" />
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
mail can also be wired to everything else you run — without writing a line of
HTTP plumbing.

It ships two nodes:

- **Warmbly** — an action node covering **179 operations across 24 resources**:
  campaigns and sequences, mailboxes and warmup, the unibox, contacts and CRM,
  analytics, deliverability, integrations, automations, webhooks and more.
- **Warmbly Trigger** — a webhook trigger that starts a workflow the moment a
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
**Settings → API keys**, granting it only the scopes the workflow needs — the
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

- **Pagination** — list operations expose **Return All** (it follows the opaque
  `next_cursor` to the end) or a **Limit**.
- **Idempotency** — write operations accept an **Idempotency Key** so a retried
  step never acts twice.
- **File uploads** — campaign attachments and contact CSV/XLSX imports stream a
  binary input field as multipart form data.
- **Reliability** — honours *Continue On Fail* and attaches `pairedItem` so
  outputs map back to their inputs.

### Warmbly Trigger

Registers a Warmbly webhook endpoint when the workflow activates, answers the
ownership-verification challenge automatically, and removes the endpoint on
deactivation. Every delivery's `X-Warmbly-Signature` (HMAC-SHA256 over the raw
body) is verified against the signing secret before the workflow runs, so spoofed
calls never reach your logic.

## Operations

<details>
<summary><strong>All 179 operations, by resource</strong></summary>

| Resource | # | Operations |
|----------|---|------------|
| **Campaign** | 21 | Create, Delete, Delete Attachment, Generate Writing, Get, Get A/B Analysis, Get Advanced Settings, Get Attachments, Get Logs, Get Many, Get Senders, Preview Template, Replace Senders, Run Preflight, Send Test Email, Start, Stop, Update, Update Advanced Settings, Upload Attachment, Verify Tracking Domain |
| **Campaign Step** | 4 | Create, Delete, Get Many, Update |
| **Campaign A/B Variant** | 4 | Create, Delete, Get Many, Update |
| **Mailbox** | 14 | Check Domain Authentication, Delete, Get, Get Many, Get Warmup Ban Status, Pause Warmup, Resume Warmup, Send Email, Start Warmup, Stop Warmup, Submit Warmup Appeal, Update, Update Tracking Domain, Verify Address |
| **Contact** | 15 | Bulk Delete, Bulk Update, Commit Import, Create, Delete, Export, Get, Get Activities, Get Deals, Get Emails, Get Timeline, Look Up by Email, Preview Import, Search, Update |
| **Contact Note** | 4 | Create, Delete, Get Many, Update |
| **Unibox** | 14 | Cancel Scheduled Send, Get Many, Get Message, Get Overview, Get Scheduled Sends, Get Snoozes, Get Thread, Get Thread Labels, Get Unseen Count, Mark Seen, Reply, Set Thread Labels, Snooze, Unsnooze |
| **Pipeline** | 8 | Create, Create Stage, Delete, Delete Stage, Get, Get Many, Update, Update Stage |
| **Deal** | 7 | Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **CRM Task** | 7 | Create, Delete, Get, Get Many, Get Summary, Search, Update |
| **CRM Task Type** | 4 | Create, Delete, Get Many, Update |
| **Reply Template** | 9 | Create, Delete, Duplicate, Get, Get Many, Render, Reorder, Score Content, Update |
| **Analytics** | 10 | Compare Campaigns, Get Account, Get Accounts, Get Campaign, Get Campaign Daily Stats, Get Campaign Hourly Stats, Get Dashboard, Get Deliverability, Get Usage, Get Warmup |
| **Audit Log** | 1 | Get Many |
| **API Key** | 10 | Create, Get, Get Analytics, Get Logs, Get Many, Get Permissions, Get Usage Analytics, Get Usage Summary, Revoke, Update |
| **Integration** | 16 | Create, Create Event Subscription, Delete, Delete Event Subscription, Get, Get Bookings, Get Catalog, Get Event Subscriptions, Get Field Mappings, Get Many, Get Sync Runs, Get Webhook Secret, Push Contacts, Replace Field Mappings, Test Connection, Update Config |
| **Automation** | 7 | Create, Delete, Get, Get Many, Get Runs, Test, Update |
| **Webhook** | 6 | Create, Delete, Get Deliveries, Get Many, Rotate Secret, Update |
| **Warmup Routing Rule** | 4 | Create, Delete, Get Many, Update |
| **Outreach Settings** | 2 | Get Settings, Update Settings |
| **Deliverability** | 1 | Ingest Event |
| **Dead Letter** | 2 | Get Many, Replay |
| **Team** | 7 | Add Member, Create, Delete, Get, Get Many, Remove Member, Update |
| **Workspace** | 2 | Get Plans, Get Timezones |

</details>

## Triggers

The Warmbly Trigger can fire on **61 event types**. Leave **Events** empty to
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
explicitly — they are never included in the "all events" default. See the
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
npm test           # fast unit tests (signature verification, parsing)
npm run test:e2e   # live integration suite against a running Warmbly
```

The end-to-end suite drives the real node against a running Warmbly instance
(`cd ~/warmbly && make infra && make seed && make run`), smoke-testing every
read endpoint and running full create → update → delete lifecycles, then writes
a coverage report. Details in [`test/README.md`](./test/README.md).

### Publishing

Releases go to npm via **OIDC trusted publishing** (no `NPM_TOKEN`): see
[`.github/workflows/publish.yml`](./.github/workflows/publish.yml). One-time
bootstrap, because trusted publishing can't create a brand-new package:

1. **First publish, manually** — `npm login`, then `npm publish`
   (`prepublishOnly` builds + lints). This claims the name and creates the
   package on npm.
2. **Enable trusted publishing** — on npmjs.com → the package → Settings →
   *Trusted Publisher* → *GitHub Actions*: org `warmbly`, repo
   `n8n-nodes-warmbly`, workflow `publish.yml`.
3. **From then on** — bump the version, push, and cut a GitHub Release; the
   workflow publishes automatically, with provenance, no secrets.

## License

[MIT](./LICENSE) © Warmbly. Not affiliated with n8n GmbH.
