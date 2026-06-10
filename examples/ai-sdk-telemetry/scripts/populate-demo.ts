import { randomUUID } from "node:crypto";
import { redis, EVENT_PREFIX, TTL_SECONDS, telemetryIndex } from "../src/redis";
import { createTelemetryIndex } from "../src/index-setup";

// DEMO SEED — wipes the database and writes a varied, synthetic telemetry set
// DIRECTLY in the stored JSON shape (no model calls). It's fast, free, and
// deterministic enough to show every chart populated during a live demo.
//
// This is the one place we hand-write events. The real write path is the AI SDK
// integration in src/telemetry.ts; use `npm run seed` for genuine model-driven
// telemetry.

type TelemetryDoc = {
  type: "generation" | "toolCall";
  functionId?: string;
  model?: string;
  toolName?: string;
  finishReason?: string;
  success?: boolean;
  durationMs?: number;
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  ts: string;
};

const NOW = Date.now();
const ago = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString();
const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

const docs: TelemetryDoc[] = [];

// --- Generations: per-agent finish-reason mix + token ranges ------------------
// `error` generations carry zero tokens (a failed call produced nothing).
type GenSpec = {
  functionId: string;
  model: string;
  count: number;
  reasons: Record<string, number>; // finishReason -> weight
  input: [number, number];
  output: [number, number];
};

const GENERATIONS: GenSpec[] = [
  { functionId: "weather-bot", model: "gpt-4o-mini", count: 16, reasons: { "tool-calls": 5, stop: 9, error: 1 }, input: [200, 900], output: [60, 320] },
  { functionId: "summarizer", model: "gpt-4o-mini", count: 12, reasons: { stop: 10, length: 2 }, input: [120, 500], output: [40, 180] },
  { functionId: "essayist", model: "gpt-4o", count: 12, reasons: { stop: 7, length: 5 }, input: [300, 1200], output: [250, 820] },
  { functionId: "status-bot", model: "gpt-4o-mini", count: 9, reasons: { stop: 8, error: 1 }, input: [160, 650], output: [60, 260] },
  { functionId: "chat-handler", model: "gpt-4o", count: 14, reasons: { stop: 9, "tool-calls": 3, error: 2 }, input: [250, 1000], output: [120, 600] },
];

const reasonPool = (weights: Record<string, number>) =>
  Object.entries(weights).flatMap(([reason, n]) => Array<string>(n).fill(reason));

function pushGeneration(spec: GenSpec, finishReason: string, minutesAgo: number) {
  const errored = finishReason === "error";
  const inputTokens = errored ? 0 : rand(spec.input[0], spec.input[1]);
  const outputTokens = errored ? 0 : rand(spec.output[0], spec.output[1]);
  docs.push({
    type: "generation",
    functionId: spec.functionId,
    model: spec.model,
    finishReason,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    ts: ago(minutesAgo),
  });
}

for (const spec of GENERATIONS) {
  const pool = reasonPool(spec.reasons);
  for (let i = 0; i < spec.count; i++) {
    pushGeneration(spec, pool[i % pool.length], rand(0, 24 * 60));
  }
}

// A handful of fresh generations so "Last 30 min" and the Recent table light up.
for (let i = 0; i < 6; i++) {
  pushGeneration(GENERATIONS[i % GENERATIONS.length], "stop", rand(0, 28));
}

// --- Tool calls: per-tool latency spread + a failure rate ---------------------
type ToolSpec = {
  toolName: string;
  functionId: string;
  model: string;
  count: number;
  failRate: number;
  dur: [number, number];
};

const TOOLS: ToolSpec[] = [
  { toolName: "getWeather", functionId: "weather-bot", model: "gpt-4o-mini", count: 20, failRate: 0.05, dur: [20, 140] },
  { toolName: "checkStatus", functionId: "status-bot", model: "gpt-4o-mini", count: 14, failRate: 0.35, dur: [30, 220] },
  { toolName: "webSearch", functionId: "chat-handler", model: "gpt-4o", count: 16, failRate: 0.12, dur: [120, 620] },
];

for (const spec of TOOLS) {
  for (let i = 0; i < spec.count; i++) {
    docs.push({
      type: "toolCall",
      functionId: spec.functionId,
      model: spec.model,
      toolName: spec.toolName,
      success: Math.random() > spec.failRate,
      durationMs: rand(spec.dur[0], spec.dur[1]),
      ts: ago(rand(0, 24 * 60)),
    });
  }
}

async function main() {
  console.log("Flushing database…");
  await redis.flushdb();

  console.log("Ensuring index…");
  await createTelemetryIndex();

  console.log(`Writing ${docs.length} events…`);
  // Mirror the integration's write path: json.set + a TTL per key. Chunk so the
  // pipelines stay a sensible size.
  const CHUNK = 40;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const pipeline = redis.pipeline();
    for (const doc of docs.slice(i, i + CHUNK)) {
      const key = `${EVENT_PREFIX}${randomUUID()}`;
      pipeline.json.set(key, "$", doc);
      pipeline.expire(key, TTL_SECONDS);
    }
    await pipeline.exec();
  }

  await telemetryIndex().waitIndexing();

  const generations = docs.filter((d) => d.type === "generation").length;
  const toolCalls = docs.filter((d) => d.type === "toolCall").length;
  const failed = docs.filter((d) => d.type === "toolCall" && d.success === false).length;
  console.log(`Done — ${generations} generations, ${toolCalls} tool calls (${failed} failed).`);
  console.log("Start the dashboard with `npm run dev`.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
