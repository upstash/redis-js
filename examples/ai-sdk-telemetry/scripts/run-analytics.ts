import { telemetryIndex } from "../src/redis";
import {
  latencyPerTool,
  tokenStatsPerFunction,
  failedToolCallCount,
  finishReasonBreakdown,
  recentGenerations,
} from "../src/analytics";

// Wait for indexing ONCE at the start of the read request — never on the write
// path. Index updates are batched; this blocks until pending docs are indexed.
await telemetryIndex().waitIndexing();

const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // last 24h

const [latency, tokens, failures, reasons, recent] = await Promise.all([
  latencyPerTool(),
  tokenStatsPerFunction(since),
  failedToolCallCount(),
  finishReasonBreakdown(),
  recentGenerations(since, 5),
]);

console.log("\n=== Tool latency (ms) — p50/p95/p99 + avg, per tool ===");
console.dir(latency, { depth: null });

console.log("\n=== Token stats per functionId (last 24h) ===");
console.dir(tokens, { depth: null });

console.log("\n=== Failed tool-call count ===");
console.log(failures);

console.log("\n=== Generations by finishReason ===");
console.dir(reasons, { depth: null });

console.log("\n=== 5 most recent generations ===");
console.dir(recent, { depth: null });
