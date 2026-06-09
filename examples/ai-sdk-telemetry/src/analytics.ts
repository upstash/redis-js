import { telemetryIndex } from "./redis";

// All analytics are Redis Search aggregations — no client-side math, no sorted
// sets. Call `waitIndexing()` ONCE at the start of a read request (see
// scripts/run-analytics.ts), never inside these functions or the write path.

// p50 / p95 / p99 latency and average per tool, successful calls only.
export async function latencyPerTool() {
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
}

// Token usage stats (count/min/max/sum/avg) per functionId over a time window.
export async function tokenStatsPerFunction(sinceISO: string) {
  const result = await telemetryIndex().aggregate({
    filter: { type: { $eq: "generation" }, ts: { $gte: sinceISO } },
    aggregations: {
      by_fn: {
        $terms: { field: "functionId" },
        $aggs: { tokens: { $stats: { field: "totalTokens" } } },
      },
    },
  });
  return result.by_fn;
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
  const result = await telemetryIndex().aggregate({
    filter: { type: { $eq: "generation" } },
    aggregations: {
      reasons: { $terms: { field: "finishReason", size: 10 } },
    },
  });
  return result.reasons;
}

// Most recent generations in a window — `ts` (a date field) replaces sorted-set
// ordering. orderBy + a date-range filter give you the time window.
export async function recentGenerations(sinceISO: string, limit = 10) {
  return telemetryIndex().query({
    filter: { type: { $eq: "generation" }, ts: { $gte: sinceISO } },
    select: { functionId: true, model: true, totalTokens: true, finishReason: true, ts: true },
    orderBy: { ts: "DESC" },
    limit,
  });
}
