# Production analytics for the Vercel AI SDK with Upstash Redis Search

Every `generateText` and `streamText` call in your app produces data you wish you
were keeping: how long each tool took, how many tokens a function burned, how
often a tool failed. The usual answer is "ship it to an observability vendor." But
if you already run Upstash Redis, you can keep that telemetry yourself — as plain
JSON documents — and compute latency percentiles, token stats, and error counts
with **Redis Search aggregations**. No sorted sets, no client-side math, no extra
service.

This post builds the whole thing: a one-time index, a `TelemetryIntegration` that
writes one document per event, a query module that answers the questions you
actually ask, and a small Next.js dashboard that charts the results.

![The finished dashboard: stat cards, a tool-latency bar chart, average tokens per function, a finish-reason donut, and a recent-generations table](./screenshots/dashboard-full.png)

<!--
SCREENSHOT 1 — dashboard-full.png (the hero image)
WHERE: top of the post, right here.
WHAT: run `npm run setup && npm run seed && npm run dev`, open http://localhost:3000,
      and capture the ENTIRE page — the four stat cards across the top, both rows
      of charts, and the recent-generations table. A full-width browser window at a
      normal zoom looks best. This is the "here's what you're building" shot.
-->

The pieces:

```
generateText / streamText
        │  experimental_telemetry.integrations
        ▼
RedisSearchTelemetry  ──json.set──▶  ai:event:<uuid>   (JSON docs)
                                          │  auto-indexed by prefix
                                          ▼
                                   ai-telemetry index
                                          │  aggregate / count / query
                                          ▼
                              p50/p95/p99 latency · token stats · error counts
                                          │  getDashboardData()
                                          ▼
                          Next.js + shadcn/ui dashboard (Recharts)
```

## The key idea: the index follows your keys

Upstash Redis Search indexes are **prefix-bound and auto-synchronizing**. You
create an index that watches `ai:event:`, and from then on every JSON key you
write under that prefix is indexed for you. There is no `index.add()`, no
`index.upsert()` — you just `redis.json.set(...)` and the index keeps up.

That single fact shapes the whole design. The write path is "drop a JSON
document." The read path is "ask the index a question."

## Step 1 — define the index (run once)

One schema, shared by the create call and every typed read:

```ts
import { Redis, s } from "@upstash/redis";

export const redis = Redis.fromEnv();
export const TTL_SECONDS = 60 * 60 * 24 * 30; // 30-day rolling window

export const telemetrySchema = s.object({
  type: s.keyword(),          // "generation" | "toolCall"
  functionId: s.keyword(),    // group/filter dimension
  model: s.keyword(),
  toolName: s.keyword(),
  finishReason: s.keyword(),
  success: s.boolean(),
  durationMs: s.number("F64"),
  totalTokens: s.number("U64"),
  inputTokens: s.number("U64"),
  outputTokens: s.number("U64"),
  ts: s.date().fast(),        // .fast() lets us orderBy / range on it
});

await redis.search.createIndex({
  name: "ai-telemetry",
  prefix: "ai:event:",
  dataType: "json",
  existsOk: true,
  schema: telemetrySchema,
});
```

Three field-type decisions matter:

- **Group-by dimensions are `s.keyword()`.** `functionId`, `model`, and `toolName`
  are the fields we slice by. KEYWORD supports both `$terms` aggregations and
  `$eq` / `$in` filters. (If you reach for `s.facet()` here — as I first did —
  Redis Search rejects it: `$terms` only accepts `U64/I64/F64/BOOL/DATE/KEYWORD`,
  and facet `$eq` wants a hierarchical path, not a plain value.)
- **Numbers are `s.number()`** so they feed `$avg`, `$percentiles`, `$stats`,
  `$range`, and `$histogram`.
- **`ts` is `s.date().fast()`.** The date field replaces any sorted-set ordering —
  but `orderBy` and range filters on a DATE require `.fast()`, otherwise you get
  `Field 'ts' is not a fast field`.

## Step 2 — the write path: a buffered integration

The Vercel AI SDK exposes a `TelemetryIntegration` interface. Implement only the
hooks you need; errors you throw inside them are caught by the SDK and never break
a generation.

`@upstash/redis` is HTTP-based, so each `json.set` + `expire` is two round trips.
On a streaming path you don't want to pay that per hook. So the integration
**buffers** every event during one generation and **flushes them in a single
pipeline** at `onFinish`:

```ts
import type { TelemetryIntegration, OnFinishEvent, OnToolCallFinishEvent } from "ai";
import { bindTelemetryIntegration } from "ai";

class RedisSearchTelemetry implements TelemetryIntegration {
  private buffer: TelemetryDoc[] = [];

  onToolCallFinish(event: OnToolCallFinishEvent) {
    this.buffer.push({
      type: "toolCall",
      toolName: event.toolCall.toolName,
      functionId: event.functionId,
      model: event.model?.modelId,
      success: event.success,         // discriminated union on `success`
      durationMs: event.durationMs,
      ts: new Date().toISOString(),
    });
  }

  async onFinish(event: OnFinishEvent) {
    this.buffer.push({
      type: "generation",
      functionId: event.functionId ?? "unknown",
      model: event.model?.modelId ?? "unknown",
      finishReason: event.finishReason,
      totalTokens: event.totalUsage.totalTokens ?? 0,
      inputTokens: event.totalUsage.inputTokens ?? 0,
      outputTokens: event.totalUsage.outputTokens ?? 0,
      ts: new Date().toISOString(),
    });
    await this.flush();
  }

  private async flush() {
    if (this.buffer.length === 0) return;
    const pipeline = redis.pipeline();
    for (const doc of this.buffer) {
      const key = `ai:event:${crypto.randomUUID()}`;
      pipeline.json.set(key, "$", doc);
      pipeline.expire(key, TTL_SECONDS);
    }
    this.buffer = [];
    await pipeline.exec(); // one round trip for the whole generation
  }
}

export function redisSearchTelemetry(): TelemetryIntegration {
  // bindTelemetryIntegration keeps `this` bound when the SDK extracts hooks as
  // callbacks. A fresh instance per call → one buffer per generation.
  return bindTelemetryIntegration(new RedisSearchTelemetry());
}
```

Two details worth calling out, because they bit me:

- **`functionId` is on the event directly** — `event.functionId`, not
  `event.telemetry?.functionId`.
- **No `waitIndexing()` here.** Indexing is batched; waiting on the write path
  would add latency to every generation. You wait once on the *read* path instead.

Wiring it into a call is one property:

```ts
const result = streamText({
  model: openai("gpt-4o"),
  prompt: "Hello!",
  experimental_telemetry: {
    isEnabled: true,
    functionId: "chat-handler",
    integrations: [redisSearchTelemetry()],
  },
});
```

## Step 3 — the read path: let Redis do the math

Every analytic is an aggregation. **Latency percentiles per tool**, successful
calls only:

```ts
const latency = await telemetryIndex().aggregate({
  filter: { type: { $eq: "toolCall" }, success: { $eq: true } },
  aggregations: {
    by_tool: {
      $terms: { field: "toolName", size: 20 },
      $aggs: {
        p: { $percentiles: { field: "durationMs", percents: [50, 95, 99] } },
        avg: { $avg: { field: "durationMs" } },
      },
    },
  },
});
```

**Token stats per function over a window** — note how `ts` replaces a sorted set:

```ts
const tokens = await telemetryIndex().aggregate({
  filter: { type: { $eq: "generation" }, ts: { $gte: yesterdayISO } },
  aggregations: {
    by_fn: {
      $terms: { field: "functionId" },
      $aggs: { tokens: { $stats: { field: "totalTokens" } } },
    },
  },
});
```

**Failure count.** `$mustNot` only *excludes*, so it can never stand alone — pair
it with `$must`. (At the root the SDK types only accept the pair when nested, so
wrap it in `$and`, which keeps the pairing explicit anyway):

```ts
const { count } = await telemetryIndex().count({
  filter: {
    $and: [{
      $must: [{ type: { $eq: "toolCall" } }],
      $mustNot: [{ success: { $eq: true } }],
    }],
  },
});
```

## Running it

```bash
npm run setup      # create the index (once)
npm run seed       # a few real gpt-4o-mini calls → emits telemetry
npm run analytics  # query the aggregations
```

`run-analytics.ts` does the one thing the write path must never do — it calls
`waitIndexing()` **once**, at the top of the read request, before querying:

```ts
await telemetryIndex().waitIndexing();
```

Real output after seeding a couple of weather-tool calls and a couple of
summaries:

```
=== Tool latency (ms) — p50/p95/p99 + avg, per tool ===
buckets: [
  { key: 'getWeather', docCount: 3,
    avg: { value: 70.2 },
    p: { values: { '50.0': 75.95, '95.0': 75.95, '99.0': 75.95 } } }
]

=== Token stats per functionId (last 24h) ===
buckets: [
  { key: 'weather-bot', docCount: 2, tokens: { count: 2, sum: 451, min: 189, max: 262, avg: 225.5 } },
  { key: 'summarizer',  docCount: 2, tokens: { count: 2, sum: 140, min: 54,  max: 86,  avg: 70   } }
]

=== Generations by finishReason ===
buckets: [ { key: 'stop', docCount: 11 } ]
```

Those numbers were computed inside Redis. The client just printed them.

## Step 4 — put a dashboard in front of it

The query module already returns chart-ready numbers, so the dashboard is thin: a
Next.js App Router page that is a **React Server Component**. It calls
`waitIndexing()` once, runs every aggregation concurrently, and hands the shaped
data to [shadcn/ui](https://ui.shadcn.com) + [Recharts](https://recharts.org)
client components.

```ts
// app/page.tsx
export const dynamic = "force-dynamic"; // always read fresh aggregations

export default async function Page() {
  const data = await getDashboardData(); // waitIndexing() + all reads in parallel
  return <Dashboard data={data} />;
}
```

`getDashboardData()` is just the aggregations from Step 3, reshaped into arrays the
charts consume — still no client-side math, the percentiles and averages arrive
pre-computed from Redis:

```ts
const latency = latencyRes.buckets.map((b) => ({
  tool: b.key,
  p50: b.p.values["50.0"],
  p95: b.p.values["95.0"],
  p99: b.p.values["99.0"],
  avg: b.avg.value,
}));
```

The top of the page is four stat cards — total generations, total tokens, tools
tracked, failed tool calls — each one a `count` or a sum of buckets.

![Four stat cards: generations, total tokens, tools tracked, and failed tool calls](./screenshots/stat-cards.png)

<!--
SCREENSHOT 2 — stat-cards.png
WHERE: right here, under the stat-cards paragraph.
WHAT: crop just the row of four cards at the very top of the dashboard
      (Generations / Total tokens / Tools tracked / Failed tool calls).
      A tight horizontal crop — no charts in frame.
-->

The `$percentiles` aggregation becomes a grouped bar chart — p50/p95/p99 side by
side for each tool, so a slow tail is obvious at a glance:

![Grouped bar chart showing p50, p95 and p99 latency in milliseconds for the getWeather tool](./screenshots/latency-chart.png)

<!--
SCREENSHOT 3 — latency-chart.png
WHERE: under the percentiles/grouped-bar paragraph.
WHAT: crop the "Tool latency" card (title + the three-colour p50/p95/p99 bar
      chart). Hover one bar first if you want the tooltip visible in the shot —
      optional but it shows the per-tool numbers nicely.
-->

The `$stats` aggregation drives a horizontal bar of average tokens per
`functionId`, and the `$terms` over `finishReason` becomes a donut:

![Side by side: a horizontal bar chart of average tokens per function, and a donut chart of finish reasons with the generation count in the center](./screenshots/tokens-and-reasons.png)

<!--
SCREENSHOT 4 — tokens-and-reasons.png
WHERE: under the $stats / $terms paragraph.
WHAT: capture the two middle cards together — "Average tokens per function"
      (horizontal bars) on the left and "Finish reasons" (donut with the total
      count in the middle) on the right. If your window is narrow and they stack
      vertically, that's fine too — just get both cards in one shot.
-->

Finally the recent-generations table, ordered by `ts` DESC — the date field
standing in for a sorted set — with a **Refresh** button that re-runs the server
fetch via `router.refresh()`:

![A table of recent generations with function, model, token count, finish-reason badge and time columns](./screenshots/recent-table.png)

<!--
SCREENSHOT 5 — recent-table.png
WHERE: under the recent-generations paragraph (the last screenshot).
WHAT: crop the "Recent generations" card — the table with Function / Model /
      Tokens / Finish / Time columns and the finish-reason badges. Include the
      Refresh button in the header if it fits.
-->

That is the entire frontend: one server component, a data-shaping function over the
Step 3 queries, and a few client chart components. The dashboard holds no state and
does no math — it renders what Redis Search already computed.

## The rolling window is free

Each key is written with a 30-day TTL. When a key expires, Redis drops it, and
because the index tracks keys by prefix, **the expired document leaves the index
automatically**. No cron, no compaction job — the window maintains itself. (The
acceptance test proves this: write a doc with a 2-second TTL, confirm it's
queryable, then watch it vanish from `count()` a few seconds later.)

## Gotchas, collected

Verified against `@upstash/redis@1.38` and `ai@6`:

1. **Group-by dimensions must be `KEYWORD`, not `FACET`.** Facets reject `$terms`
   and want path-style values for `$eq`.
2. **`orderBy` / range on a date needs `s.date().fast()`.**
3. **`$mustNot` is never alone** — and at the root, nest the must/mustNot pair.
4. **`event.functionId`**, not `event.telemetry?.functionId`.
5. **Never `waitIndexing()` on the write path**; do it once per read request.
6. **Result shapes:** buckets carry `docCount`; `$avg` → `{ value }`; `$stats` →
   `{ count, min, max, sum, avg }`; `$percentiles` → `{ values: { "50.0": … } }`.

## Wrap-up

A `TelemetryIntegration` that drops JSON, a prefix-bound index that follows those
keys, and a handful of aggregations: that's a complete, self-maintaining analytics
layer for the AI SDK on infrastructure you already run. Point a dashboard route at
the query module and you have latency percentiles and token economics per function
— without standing up anything new.

Get a free Redis to try it: <https://upstash.com/start-redis>.
