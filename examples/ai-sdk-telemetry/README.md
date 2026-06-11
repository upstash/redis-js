# AI SDK telemetry → Upstash Redis Search

Capture Vercel AI SDK generations and tool calls as JSON in Upstash Redis, and
serve the analytics — latency percentiles, token stats, error counts — entirely
with **Redis Search aggregations**. Comes with a Next.js dashboard.

Add the integration to any AI SDK call:

```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { redisSearchTelemetry } from "./src/telemetry";

await generateText({
  model: openai("gpt-4o-mini"),
  prompt,
  experimental_telemetry: {
    isEnabled: true,
    functionId: "weather-bot",
    integrations: [redisSearchTelemetry()], // one instance per call
  },
});
```

That's the whole write path. The integration buffers a generation's events and
flushes them in one pipeline at `onFinish`; every key written under the
`ai:event:` prefix is auto-indexed. Read it back with aggregations — Redis does
the math, no sorted sets:

```ts
import { telemetryIndex } from "./src/redis";

const index = telemetryIndex();
await index.waitIndexing(); // once per read request, never on the write path

// p50 / p95 / p99 latency per tool
await index.aggregate({
  filter: { type: { $eq: "toolCall" }, success: { $eq: true } },
  aggregations: {
    by_tool: {
      $terms: { field: "toolName", size: 20 },
      $aggs: {
        p: { $percentiles: { field: "durationMs", percents: [50, 95, 99] } },
      },
    },
  },
});
```

## Run

```bash
npm install
cp .env.example .env   # UPSTASH_REDIS_REST_URL/TOKEN + OPENAI_API_KEY
npm run dev            # dashboard at http://localhost:3000
```

The dashboard ensures the index exists on load (`createIndex` with
`existsOk: true`), lets you run an agent or seed sample data from the page, and
renders every chart from a single aggregation. CLI scripts: `npm run seed`
(emit real telemetry), `npm run analytics` (print the reads), `npm run test`
(acceptance checks). A 30-day TTL on each key gives a self-maintaining rolling
window.

## Error handling (AI SDK v6)

The v6 `TelemetryIntegration` exposes only success-path hooks — no `onError`:

- **Tool errors are recorded.** A throwing tool fires `onToolCallFinish` with
  `success: false`, and the generation still finishes (`finishReason: "stop"`).
- **LLM-call errors are not.** If the model `fetch` throws or returns a non-2xx
  response, `generateText` throws before `onFinish` runs — only `onStart` /
  `onStepStart` fire, so nothing is written and there's no `error` finish reason
  to read. Reproduce it by overriding `fetch` in `createOpenAI`
  ([cookbook](https://ai-sdk.dev/cookbook/node/intercept-fetch-requests)).

**AI SDK v7 adds an `onError` hook to the telemetry integration** — the clean way
to capture failed LLM calls. This example will adopt it on upgrade.
