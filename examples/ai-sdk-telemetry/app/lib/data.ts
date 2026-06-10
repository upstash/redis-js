import { telemetryIndex, INDEX_NAME, EVENT_PREFIX } from "@/src/redis";
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
  input: number;
  output: number;
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

// Metadata about the index itself, read from SEARCH.DESCRIBE plus a couple of
// counts — lets the UI show that the index exists and what it contains.
export type IndexStatus = {
  name: string;
  exists: boolean;
  dataType: string;
  prefix: string;
  fieldCount: number;
  generations: number;
  toolCalls: number;
};

export type DashboardData = {
  index: IndexStatus;
  latency: LatencyRow[];
  tokens: TokenRow[];
  finishReasons: FinishReasonRow[];
  recent: RecentRow[];
  failedToolCalls: number;
  totalGenerations: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  last30mGenerations: number;
};

export async function getDashboardData(): Promise<DashboardData> {
  // Wait for indexing ONCE per request, then run every read concurrently.
  await telemetryIndex().waitIndexing();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const since30m = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const [latencyRes, tokenRes, failures, reasonRes, recentRes, index, last30m] = await Promise.all([
    latencyPerTool(),
    tokenStatsPerFunction(since),
    failedToolCallCount(),
    finishReasonBreakdown(),
    recentGenerations(since, 10),
    getIndexStatus(),
    telemetryIndex().count({ filter: { type: { $eq: "generation" }, ts: { $gte: since30m } } }),
  ]);

  const latency: LatencyRow[] = latencyRes.buckets.map((b) => ({
    tool: b.key,
    p50: round(b.p.values["50.0"]),
    p95: round(b.p.values["95.0"]),
    p99: round(b.p.values["99.0"]),
    avg: round(b.avg.value),
    calls: b.docCount,
  }));

  const tokens: TokenRow[] = tokenRes.buckets.map((b) => ({
    functionId: b.key,
    total: b.tokens.sum,
    input: b.inputTokens.sum,
    output: b.outputTokens.sum,
    avg: round(b.tokens.avg),
    min: b.tokens.min,
    max: b.tokens.max,
    calls: b.tokens.count,
  }));

  const finishReasons: FinishReasonRow[] = reasonRes.buckets.map((b) => ({
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
    index,
    latency,
    tokens,
    finishReasons,
    recent,
    failedToolCalls: failures,
    totalGenerations: finishReasons.reduce((sum, r) => sum + r.count, 0),
    totalTokens: tokens.reduce((sum, t) => sum + t.total, 0),
    totalInputTokens: tokens.reduce((sum, t) => sum + t.input, 0),
    totalOutputTokens: tokens.reduce((sum, t) => sum + t.output, 0),
    last30mGenerations: last30m.count,
  };
}

// SEARCH.DESCRIBE confirms the index exists and exposes its schema/prefix; two
// counts show how many events of each type are currently indexed.
async function getIndexStatus(): Promise<IndexStatus> {
  const index = telemetryIndex();
  const [description, generations, toolCalls] = await Promise.all([
    index.describe(),
    index.count({ filter: { type: { $eq: "generation" } } }),
    index.count({ filter: { type: { $eq: "toolCall" } } }),
  ]);

  return {
    name: INDEX_NAME,
    exists: description !== null,
    dataType: description?.dataType ?? "json",
    prefix: description?.prefixes?.[0] ?? EVENT_PREFIX,
    fieldCount: description ? Object.keys(description.schema ?? {}).length : 0,
    generations: generations.count,
    toolCalls: toolCalls.count,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
