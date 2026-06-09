import { telemetryIndex } from "@/src/redis";
import {
  latencyPerTool,
  tokenStatsPerFunction,
  failedToolCallCount,
  finishReasonBreakdown,
  recentGenerations,
} from "@/src/analytics";

// Shapes the raw Redis Search aggregation output into arrays the chart and
// table components consume. All numbers come straight from the aggregations —
// no client-side math (averages/percentiles are computed by Redis).

export type LatencyRow = {
  tool: string;
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  calls: number;
};

export type TokenRow = {
  functionId: string;
  total: number;
  avg: number;
  min: number;
  max: number;
  calls: number;
};

export type FinishReasonRow = { reason: string; count: number };

export type RecentRow = {
  functionId: string;
  model: string;
  totalTokens: number;
  finishReason: string;
  ts: string;
};

export type DashboardData = {
  latency: LatencyRow[];
  tokens: TokenRow[];
  finishReasons: FinishReasonRow[];
  recent: RecentRow[];
  failedToolCalls: number;
  totalGenerations: number;
  totalTokens: number;
};

export async function getDashboardData(): Promise<DashboardData> {
  // Wait for indexing ONCE per request, then run every read concurrently.
  await telemetryIndex().waitIndexing();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [latencyRes, tokenRes, failures, reasonRes, recentRes] = await Promise.all([
    latencyPerTool(),
    tokenStatsPerFunction(since),
    failedToolCallCount(),
    finishReasonBreakdown(),
    recentGenerations(since, 10),
  ]);

  const latency: LatencyRow[] = (latencyRes?.buckets ?? []).map((b) => ({
    tool: b.key,
    p50: round(b.p.values["50.0"]),
    p95: round(b.p.values["95.0"]),
    p99: round(b.p.values["99.0"]),
    avg: round(b.avg.value),
    calls: b.docCount,
  }));

  const tokens: TokenRow[] = (tokenRes?.buckets ?? []).map((b) => ({
    functionId: b.key,
    total: b.tokens.sum,
    avg: round(b.tokens.avg),
    min: b.tokens.min,
    max: b.tokens.max,
    calls: b.tokens.count,
  }));

  const finishReasons: FinishReasonRow[] = (reasonRes?.buckets ?? []).map((b) => ({
    reason: b.key,
    count: b.docCount,
  }));

  const recent: RecentRow[] = recentRes.map((r) => ({
    functionId: r.data.functionId,
    model: r.data.model,
    totalTokens: r.data.totalTokens,
    finishReason: r.data.finishReason,
    ts: r.data.ts,
  }));

  return {
    latency,
    tokens,
    finishReasons,
    recent,
    failedToolCalls: failures,
    totalGenerations: finishReasons.reduce((sum, r) => sum + r.count, 0),
    totalTokens: tokens.reduce((sum, t) => sum + t.total, 0),
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
