# AI SDK telemetry → Upstash Redis Search

Capture Vercel AI SDK generation and tool-call events as JSON documents in
Upstash Redis, serve analytics (latency percentiles, token stats, error
counts, time-windowed views) entirely with **Upstash Redis Search
aggregations** — no sorted sets, no client-side math — and view them on a
**Next.js dashboard** with charts.

```
generateText / streamText
        │  experimental_telemetry.integrations
        ▼
RedisSearchTelemetry  ──json.set──▶  ai:event:<uuid>  (JSON docs)
                                          │  auto-indexed by prefix
                                          ▼
                                   ai-telemetry index
                                          │  aggregate / count / query
                                          ▼
                              latency p50/p95/p99, token stats, error counts
                                          │  getDashboardData()
                                          ▼
                          Next.js + shadcn/ui dashboard (Recharts)
```

## The dashboard

A minimal Next.js (App Router) app renders the aggregations as charts with
[shadcn/ui](https://ui.shadcn.com) + [Recharts](https://recharts.org):

- **Stat cards** — total generations, total tokens, tools tracked, failed tool calls.
- **Tool latency** — grouped bar chart of p50 / p95 / p99 per tool (`$percentiles`).
- **Average tokens per function** — horizontal bar chart (`$stats` grouped by `functionId`).
- **Finish reasons** — donut chart of generation outcomes (`$terms`).
- **Recent generations** — table ordered by `ts` DESC (no sorted sets).

The page is a React Server Component (`export const dynamic = "force-dynamic"`):
every request calls `waitIndexing()` once, then runs all aggregations
concurrently and passes the shaped data to client chart components. A **Refresh**
button re-runs the server fetch via `router.refresh()`.

```bash
npm run dev    # http://localhost:3000
```

## How it works

- The Redis Search index has a **prefix** (`ai:event:`) and **auto-synchronizes**:
  once it exists, every JSON key written under that prefix is indexed
  automatically. There is no `index.add()` / `index.upsert()`.
- The `TelemetryIntegration` writes one JSON document per event. It **buffers**
  events during a generation and flushes them in a **single pipeline** at
  `onFinish`, so a hot streaming path pays one HTTP round trip, not one per hook.
- Analytics are Redis Search **aggregations** (`$terms`, `$percentiles`,
  `$stats`, `$avg`) and `count`. Redis does the math.
- A **30-day TTL** on each key gives a self-maintaining rolling window: expired
  keys leave the index automatically — no cleanup job.

## Layout

```
src/
  redis.ts         Shared client, schema, TTL, typed index handle
  index-setup.ts   createTelemetryIndex() — run once
  telemetry.ts     RedisSearchTelemetry integration (buffered, pipelined write)
  analytics.ts     Aggregation reads (latency, tokens, failures, recent)
app/
  layout.tsx       Root layout
  page.tsx         Dashboard (RSC, force-dynamic)
  globals.css      Tailwind v4 + shadcn tokens
  lib/data.ts      getDashboardData() — shapes aggregations for charts
components/
  ui/              Vendored shadcn primitives (card, chart, table, …)
  dashboard/       Chart + refresh client components
lib/utils.ts       cn() helper
scripts/
  setup-index.ts       Create the index
  seed.ts              Make real model calls that emit telemetry
  run-analytics.ts     Run every analytics read and print results
  test-acceptance.ts   Validates all acceptance criteria end-to-end
  _shared.ts           A small weather tool used by seed/test
tutorial.md        Blog-style walkthrough
tweet.md           Tweet draft + code snippet for the image
```

## Prerequisites

- Node 20+ (uses the global `crypto.randomUUID()` and native `fetch`).
- An Upstash Redis database. No DB? Get a free one (no signup, 3-day TTL) at
  <https://upstash.com/start-redis>, or a permanent one from the Upstash console.
- An OpenAI API key — only the `seed` and `test` scripts call a model.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the three values
```

Environment variables (already exported in some sandboxes):

```bash
UPSTASH_REDIS_REST_URL=https://<your-db>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
OPENAI_API_KEY=sk-...
```

## Run

```bash
npm run setup      # create the index (once; safe to re-run)
npm run seed       # make a few real gpt-4o-mini calls → emits telemetry
npm run analytics  # query the aggregations and print them
npm run test       # acceptance test: validates all 5 criteria against live services
npm run dev        # start the dashboard at http://localhost:3000
```

`npm run seed` and `npm run test` spend a small number of `gpt-4o-mini` tokens.
`npm run setup`, `npm run analytics`, and the dashboard hit only Upstash.

To view the dashboard with data: `npm run setup && npm run seed && npm run dev`,
then open <http://localhost:3000>. For a production build use
`npm run build && npm run start`.

## Wiring it into your own app

```ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { redisSearchTelemetry } from "./src/telemetry";

const result = streamText({
  model: openai("gpt-4o"),
  prompt: "Hello!",
  experimental_telemetry: {
    isEnabled: true,
    functionId: "chat-handler",
    integrations: [redisSearchTelemetry()], // one instance per call
  },
});
```

Then read analytics on your dashboard route — call `waitIndexing()` **once** at
the start of the request, never on the write path:

```ts
import { telemetryIndex } from "./src/redis";
import { latencyPerTool } from "./src/analytics";

await telemetryIndex().waitIndexing();
const latency = await latencyPerTool();
```

## Gotchas we hit (and what actually works)

These differ from a first reading of the docs; the code reflects the verified
behavior on `@upstash/redis@1.38` / `ai@6`:

| Symptom | Fix |
| --- | --- |
| `$terms` / `$eq` on a `FACET` field → *"cannot be used with $terms"* / *"Couldn't parse the value as facet path"* | Use `s.keyword()` for group-by dimensions (`functionId`, `model`, `toolName`). KEYWORD supports both `$terms` and `$eq`/`$in`. |
| `orderBy: { ts: "DESC" }` → *"Field `ts` is not a fast field"* | Declare the date as `s.date().fast()`. |
| Root `{ $must, $mustNot }` doesn't type-check | The bare must/mustNot node is only valid **nested** (e.g. under `$and`). `$mustNot` never stands alone. |
| `functionId` is `undefined` in hooks | It's `event.functionId`, not `event.telemetry?.functionId`. |

Aggregation result shapes: buckets use `docCount`; `$avg` → `{ value }`;
`$stats` → `{ count, min, max, sum, avg }`; `$percentiles` → `{ values: { "50.0": … } }`.
