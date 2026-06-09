# Tweet draft

## Tweet (single, 273 chars)

Wire Vercel AI SDK telemetry straight into Upstash Redis Search 🧵→📊

Every generation + tool call becomes a JSON doc. Latency p50/p95/p99 and token
stats come from Redis Search aggregations — no sorted sets, no client math. 30-day
TTL = a rolling window that cleans itself.

## Code snippet (attach as image)

```ts
// WRITE: one TelemetryIntegration, buffered + flushed in a single pipeline
class RedisSearchTelemetry implements TelemetryIntegration {
  async onFinish(e: OnFinishEvent) {
    await redis.json.set(`ai:event:${crypto.randomUUID()}`, "$", {
      type: "generation",
      functionId: e.functionId,
      model: e.model?.modelId,
      totalTokens: e.totalUsage.totalTokens,
      ts: new Date().toISOString(),
    });
  }
}

// READ: latency percentiles per tool — Redis does the math
const latency = await index.aggregate({
  filter: { type: { $eq: "toolCall" }, success: { $eq: true } },
  aggregations: {
    by_tool: {
      $terms: { field: "toolName", size: 20 },
      $aggs: {
        p:   { $percentiles: { field: "durationMs", percents: [50, 95, 99] } },
        avg: { $avg: { field: "durationMs" } },
      },
    },
  },
});
```
