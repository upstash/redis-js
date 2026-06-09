import { telemetryIndex } from "./redis";

// All analytics are Redis Search aggregations — no client-side math, no sorted
// sets. Call `waitIndexing()` ONCE at the start of a read request (see
// scripts/run-analytics.ts), never inside these functions or the write path.

// An aggregation that matches no documents (e.g. before any telemetry has been
// ingested) comes back as `null` from Redis, which the SDK then fails to parse
// — it reads `.length` on null and throws a TypeError. Treat that specific
// "no data yet" signature as an empty bucket list so the dashboard renders
// zeros instead of crashing; re-throw anything else.
const EMPTY_TERMS = { buckets: [] as never[] };
async function termsOrEmpty<T extends { buckets: unknown }>(
  run: () => Promise<T>
): Promise<T | typeof EMPTY_TERMS> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("length")) return EMPTY_TERMS;
    throw error;
  }
}

// p50 / p95 / p99 latency and average per tool, successful calls only.
export async function latencyPerTool() {
  return termsOrEmpty(async () => {
    const result = await telemetryIndex().aggregate({
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
    return result.by_tool;
  });
}

// Token usage stats (count/min/max/sum/avg) per functionId over a time window.
export async function tokenStatsPerFunction(sinceISO: string) {
  return termsOrEmpty(async () => {
    const result = await telemetryIndex().aggregate({
      filter: { type: { $eq: "generation" }, ts: { $gte: sinceISO } },
      aggregations: {
        by_fn: {
          $terms: { field: "functionId" },
          $aggs: {
            tokens: { $stats: { field: "totalTokens" } },
            inputTokens: { $stats: { field: "inputTokens" } },
            outputTokens: { $stats: { field: "outputTokens" } },
          },
        },
      },
    });
    return result.by_fn;
  });
}

// Number of failed tool calls. $mustNot only excludes, so it must be paired
// with $must — alone it returns nothing. At the root the SDK types only accept
// the must/mustNot pair when nested (here under $and), which keeps the pairing
// explicit.
export async function failedToolCallCount() {
  const { count } = await telemetryIndex().count({
    filter: {
      $and: [
        {
          $must: [{ type: { $eq: "toolCall" } }],
          $mustNot: [{ success: { $eq: true } }],
        },
      ],
    },
  });
  return count;
}

// Breakdown of generations by finishReason (e.g. stop vs tool-calls vs length).
export async function finishReasonBreakdown() {
  return termsOrEmpty(async () => {
    const result = await telemetryIndex().aggregate({
      filter: { type: { $eq: "generation" } },
      aggregations: {
        reasons: { $terms: { field: "finishReason", size: 10 } },
      },
    });
    return result.reasons;
  });
}

// Most recent generations in a window — `ts` (a date field) replaces sorted-set
// ordering. orderBy + a date-range filter give you the time window.
export async function recentGenerations(sinceISO: string, limit = 10) {
  // query() returns null when nothing matches the filter (e.g. no generations in
  // the window yet); normalize to [] so callers can always .map over it.
  const result = await telemetryIndex().query({
    filter: { type: { $eq: "generation" }, ts: { $gte: sinceISO } },
    select: { functionId: true, model: true, totalTokens: true, finishReason: true, ts: true },
    orderBy: { ts: "DESC" },
    limit,
  });
  return result ?? [];
}
