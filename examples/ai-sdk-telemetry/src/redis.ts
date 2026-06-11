import { Redis, s } from "@upstash/redis";

export const redis = Redis.fromEnv();

export const INDEX_NAME = "ai-telemetry";
export const EVENT_PREFIX = "ai:event:";

// 30-day rolling window. Expired keys leave the index automatically, so the
// window is self-maintaining — no cleanup job needed.
export const TTL_SECONDS = 60 * 60 * 24 * 30;

// One schema, shared by the index-creation call and every typed read.
//
// - Dimensions grouped via `$terms` (functionId, model, toolName) are KEYWORD,
//   not FACET. In this SDK, `$terms` and `$eq`/`$in` only accept
//   U64/I64/F64/BOOL/DATE/KEYWORD — FACET fields raise "cannot be used with
//   $terms" and "Couldn't parse the value as facet path". Keyword gives us both
//   group-by and exact-match filtering.
// - Numeric fields are numbers so they support `$avg`, `$percentiles`,
//   `$stats`, `$range`, `$histogram`.
// - `ts` is a date: it replaces any sorted-set ordering — sort and window
//   with `orderBy` / date-range filters.
export const telemetrySchema = s.object({
  type: s.keyword(), // "generation" | "toolCall"
  functionId: s.keyword(),
  model: s.keyword(),
  toolName: s.keyword(),
  finishReason: s.keyword(),
  success: s.boolean(),
  durationMs: s.number("F64"),
  totalTokens: s.number("U64"),
  inputTokens: s.number("U64"),
  outputTokens: s.number("U64"),
  ts: s.date().fast(), // .fast() is required to orderBy / range-filter a DATE
});

// Typed handle to an index that already exists. Use this on the read path.
export function telemetryIndex() {
  return redis.search.index({ name: INDEX_NAME, schema: telemetrySchema });
}
