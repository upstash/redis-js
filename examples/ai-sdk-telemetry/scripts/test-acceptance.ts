import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateText, stepCountIs, bindTelemetryIntegration } from "ai";
import type { TelemetryIntegration } from "ai";
import { openai } from "@ai-sdk/openai";
import { redis, EVENT_PREFIX, telemetryIndex } from "../src/redis";
import { createTelemetryIndex } from "../src/index-setup";
import { redisSearchTelemetry } from "../src/telemetry";
import { weatherTool } from "./_shared";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const RUN = `test-${Date.now()}`;
const idx = telemetryIndex();
const createdKeys: string[] = [];

async function writeDoc(suffix: string, doc: Record<string, unknown>, ttl?: number) {
  const key = `${EVENT_PREFIX}${RUN}:${suffix}`;
  await redis.json.set(key, "$", doc);
  if (ttl) await redis.expire(key, ttl);
  createdKeys.push(key);
  return key;
}

console.log(`\nAcceptance test (run tag: ${RUN})\n`);
await createTelemetryIndex();

// ---------------------------------------------------------------------------
// Criterion 3: the write path performs no waitIndexing() call (static check)
// ---------------------------------------------------------------------------
const telemetrySrc = readFileSync(
  fileURLToPath(new URL("../src/telemetry.ts", import.meta.url)),
  "utf8",
)
  .replace(/\/\*[\s\S]*?\*\//g, "") // strip block comments
  .replace(/\/\/.*$/gm, ""); // strip line comments
check("C3: integration write path makes no waitIndexing() call", !/waitIndexing/.test(telemetrySrc));

// ---------------------------------------------------------------------------
// Criterion 5: an integration error does not interrupt the generation
// ---------------------------------------------------------------------------
const throwing: TelemetryIntegration = bindTelemetryIntegration({
  onFinish() {
    throw new Error("intentional integration failure");
  },
});
const safe = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "Reply with exactly: ok",
  experimental_telemetry: { isEnabled: true, functionId: `${RUN}-throw`, integrations: [throwing] },
});
check("C5: generateText still returns text despite a throwing integration", safe.text.trim().length > 0, `text="${safe.text.trim().slice(0, 20)}"`);

// ---------------------------------------------------------------------------
// Criterion 1: events written via the real integration become queryable
// ---------------------------------------------------------------------------
await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "What's the weather in Paris?",
  tools: { getWeather: weatherTool },
  stopWhen: stepCountIs(5),
  experimental_telemetry: { isEnabled: true, functionId: RUN, integrations: [redisSearchTelemetry()] },
});
await idx.waitIndexing();

const gen = await idx.query({
  filter: { type: { $eq: "generation" }, functionId: { $eq: RUN } },
  select: {},
});
check("C1: generation event from integration is queryable", gen.length >= 1, `${gen.length} doc(s)`);

const toolEvents = await idx.query({
  filter: { type: { $eq: "toolCall" }, functionId: { $eq: RUN } },
  select: {},
});
check("C1: toolCall event from integration is queryable", toolEvents.length >= 1, `${toolEvents.length} doc(s)`);

// ---------------------------------------------------------------------------
// Criterion 2: analytics computed by Redis Search aggregations (no client math)
// ---------------------------------------------------------------------------
// Synthetic, known values isolated by toolName/functionId == RUN.
const durations = [100, 200, 300, 400, 500]; // avg = 300
for (let i = 0; i < durations.length; i++) {
  await writeDoc(`tool-ok-${i}`, { type: "toolCall", toolName: RUN, success: true, durationMs: durations[i], ts: new Date().toISOString() });
}
// Two failed tool calls.
for (let i = 0; i < 2; i++) {
  await writeDoc(`tool-fail-${i}`, { type: "toolCall", toolName: RUN, success: false, durationMs: 999, ts: new Date().toISOString() });
}
// Generations with known token totals: sum 60, avg 20, count 3.
// Use a distinct functionId so the real C1 call (functionId == RUN) is excluded.
const SYN_FN = `${RUN}-syn`;
const tokenTotals = [10, 20, 30];
for (let i = 0; i < tokenTotals.length; i++) {
  await writeDoc(`gen-${i}`, { type: "generation", functionId: SYN_FN, model: "synthetic", finishReason: "stop", totalTokens: tokenTotals[i], inputTokens: tokenTotals[i], outputTokens: 0, ts: new Date().toISOString() });
}
await idx.waitIndexing();

const latency = await idx.aggregate({
  filter: { type: { $eq: "toolCall" }, toolName: { $eq: RUN }, success: { $eq: true } },
  aggregations: {
    by_tool: {
      $terms: { field: "toolName", size: 5 },
      $aggs: {
        p: { $percentiles: { field: "durationMs", percents: [50, 95, 99] } },
        avg: { $avg: { field: "durationMs" } },
      },
    },
  },
});
const bucket: any = latency.by_tool.buckets.find((b: any) => b.key === RUN);
check("C2: $terms grouped the synthetic tool", bucket?.docCount === 5, `docCount=${bucket?.docCount}`);
check("C2: $avg(durationMs) == 300 (Redis-computed)", bucket?.avg?.value === 300, `got ${JSON.stringify(bucket?.avg)}`);
const pv = bucket?.p?.values ?? {};
check("C2: $percentiles ordered p50<=p95<=p99", pv["50.0"] <= pv["95.0"] && pv["95.0"] <= pv["99.0"], JSON.stringify(pv));

const tokenAgg = await idx.aggregate({
  filter: { type: { $eq: "generation" }, functionId: { $eq: SYN_FN } },
  aggregations: {
    by_fn: { $terms: { field: "functionId" }, $aggs: { tokens: { $stats: { field: "totalTokens" } } } },
  },
});
const fnBucket: any = tokenAgg.by_fn.buckets.find((b: any) => b.key === SYN_FN);
check("C2: $stats sum(totalTokens) == 60", fnBucket?.tokens?.sum === 60, `got ${fnBucket?.tokens?.sum}`);
check("C2: $stats avg(totalTokens) == 20", fnBucket?.tokens?.avg === 20, `got ${fnBucket?.tokens?.avg}`);

const { count: failCount } = await idx.count({
  filter: {
    $and: [
      { $must: [{ type: { $eq: "toolCall" } }, { toolName: { $eq: RUN } }], $mustNot: [{ success: { $eq: true } }] },
    ],
  },
});
check("C2: failed tool-call count == 2 ($must + $mustNot)", failCount === 2, `got ${failCount}`);

// ---------------------------------------------------------------------------
// Criterion 4: TTL drops keys from the index automatically
// ---------------------------------------------------------------------------
const ttlKey = await writeDoc("ttl", { type: "generation", functionId: `${RUN}-ttl`, model: "synthetic", finishReason: "stop", totalTokens: 1, inputTokens: 1, outputTokens: 0, ts: new Date().toISOString() }, 2);
await idx.waitIndexing();
const before = await idx.count({ filter: { functionId: { $eq: `${RUN}-ttl` } } });
check("C4: TTL'd event is present before expiry", before.count === 1, `count=${before.count}`);

// The TTL itself is deterministic: Redis physically removes the key. Index
// reaping is eventually-consistent (normally a few seconds), so poll for it.
let exists = 1;
let after = before.count;
const deadline = Date.now() + 60000;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 2000));
  exists = await redis.exists(ttlKey);
  await idx.waitIndexing();
  after = (await idx.count({ filter: { functionId: { $eq: `${RUN}-ttl` } } })).count;
  if (exists === 0 && after === 0) break;
}
check("C4: TTL physically removes the key from Redis", exists === 0, `exists=${exists}`);
check("C4: event disappears from index query results", after === 0, `count=${after}`);

// Cleanup synthetic keys (TTL ones already gone).
if (createdKeys.length) await redis.del(...createdKeys);

console.log(`\n${failed === 0 ? "ALL PASSED" : "SOME FAILED"} — ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
