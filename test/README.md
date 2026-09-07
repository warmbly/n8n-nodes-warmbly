# Tests

Two layers, run by separate scripts.

## Unit (`npm test`)

Pure, fast, no network. Runs in CI. Covers:

- `verifyWarmblySignature`: the HMAC-SHA256 webhook signature gate (valid /
  tampered / wrong-secret / swapped-timestamp / malformed).
- `extractArray` and `coerceValue`: the response-envelope and parameter
  coercion plumbing.
- **API coverage**: every operation in `spec/warmbly-api.json` (the recorded
  Warmbly surface) is reachable from the node, the node offers nothing the API
  does not serve, and every registry field has a UI field to come from. No
  network and no Warmbly checkout needed, so it guards the coverage promise on
  every CI run.

## End-to-end (`npm run test:e2e`)

Drives the **real node code** (`Warmbly.execute()`) against a **real Warmbly
server**. The mock execution context (`helpers/executeContext.ts`) implements
only the `IExecuteFunctions` members the node touches, but routes the request
helpers at a live HTTP call, so every test exercises the node's actual
field-mapping, pagination, multipart and response-extraction logic, exactly as
n8n would at runtime.

What it does, in order, in one file (so the coverage tally is shared):

1. **Read smoke**: every `GET` operation that needs no fixtures is called and
   asserted to return a clean array.
2. **Write lifecycles**: `create → read → update → delete` round-trips for
   pipeline (incl. stages), reply template (incl. duplicate/render/score/
   reorder), CRM task type, team, CRM task, deal, webhook, contact + notes,
   warmup routing, automation, API key, segment (incl. members and campaign
   attachment), suppression list, meeting, AI skill, OAuth application, compose
   draft, the three group types (campaign folder, mailbox tag, contact
   category), and one shared campaign with its steps and A/B variants. Plus
   real multipart uploads (campaign attachment, contact CSV import, application
   logo), bulk contact edits, inbox message actions, mailbox hold/release and
   bulk tagging, an agent-tool call, search/export, outreach settings, and
   id-scoped analytics.
3. **Coverage accounting**: asserts every operation in `RESOURCE_OPERATIONS` is
   either executed or skipped-with-reason (nothing silently uncovered), and
   writes `test/.e2e-report.json`.

The last full run against a seeded local instance executed **219 of 305**
operations with no failures; every one of the remaining 86 carries a concrete
reason (below). The exact split moves a little run to run with what the
workspace holds (a campaign with no logs yet, a mailbox with no sync record).

### Resilience

The request layer retries transient `429`/`5xx`. If the API still throttles
(e.g. Warmbly caps **new campaigns at 20 per org per day**, which a busy dev day
can exhaust), the affected write is recorded as *skipped* (`throttled / daily
quota`), not failed, and dependent steps short-circuit. A genuine `4xx` on a
write (bad payload) still **fails** the run, so real bugs aren't masked. The
suite also creates a single shared campaign (rather than several) to stay well
under that daily cap.

If a run shows campaign-family ops skipped, it's almost always the daily cap;
it resets at UTC midnight. The executed-vs-skipped split therefore varies with
how much campaign churn the instance has seen that day.

### Running it

```bash
# 1. Start Warmbly locally (Go backend in ~/warmbly)
cd ~/warmbly && make infra && make seed && make run

# 2. Run the suite (defaults below match a fresh `make seed`)
cd <this repo> && npm run test:e2e
```

Configuration (all optional; see `helpers/config.ts`):

| Env var             | Default                                          |
|---------------------|--------------------------------------------------|
| `WARMBLY_BASE_URL`  | `http://localhost:8080/v1`                       |
| `WARMBLY_API_KEY`   | the `make seed` full-access key                  |
| `WARMBLY_TIMEOUT_MS`| `20000`                                          |

The suite mints its own high-rate-limit runner key at startup (the default
seed key is capped at 60 req/min, which a full-surface pass would exceed), then
runs everything under it. If minting isn't possible it falls back to the
configured key and the request layer's backoff copes.

### What's intentionally **not** executed

The coverage report lists every skip with a reason. The categories:

- **Side-effecting / external-dependency** ops (sending email, warmup, DNS auth,
  AI generation, 3rd-party integrations) can't be validated on a bare instance.
- **Missing fixture data**: an advisor finding to dismiss, an agent draft to
  approve, a past webhook delivery to replay, a second workspace user to add to
  a team.
- **Would break the run**: revoking the suite's own API key, deleting a seeded
  mailbox the later specs read.
- **Known server-side failures**, recorded rather than masked: `POST /forms`
  500s because the create path leaves `forms.allowed_domains` NULL against a
  NOT NULL column, which blocks every form operation that needs a form to
  exist; `GET /emails/{id}` 500s for seeded mailboxes.

To grow coverage further, add a `create → … → delete` block in
`e2e/warmbly.e2e.test.ts`; the accounting picks it up automatically.
