# Tweet draft

## Tweet (single)

Wire @aisdk telemetry straight into @upstash Redis Search 🧵→📊

Every generation + tool call becomes a JSON doc. Latency p50/p95/p99 and token
stats come from Redis Search aggregations — no sorted sets, no client math. A
30-day TTL gives you a rolling window that cleans itself.

Blog post on the way 👀

## Code snippet (attach as image)

```ts
import { generateText, bindTelemetryIntegration } from "ai";
import type { TelemetryIntegration, OnFinishEvent, OnToolCallFinishEvent } from "ai";
import { openai } from "@ai-sdk/openai";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// One integration → a JSON doc per tool call and per generation.
const redisSearchTelemetry = (): TelemetryIntegration =>
  bindTelemetryIntegration({
    onToolCallFinish: (e: OnToolCallFinishEvent) =>
      redis.json.set(`ai:event:${crypto.randomUUID()}`, "$", {
        type: "toolCall",
        toolName: e.toolCall.toolName,
        success: e.success,
        durationMs: e.durationMs,
        ts: new Date().toISOString(),
      }),
    onFinish: (e: OnFinishEvent) =>
      redis.json.set(`ai:event:${crypto.randomUUID()}`, "$", {
        type: "generation",
        functionId: e.functionId,
        model: e.model?.modelId,
        finishReason: e.finishReason,
        totalTokens: e.totalUsage.totalTokens,
        ts: new Date().toISOString(),
      }),
  });

await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "What's the weather in Paris?",
  experimental_telemetry: {
    isEnabled: true,
    functionId: "weather-bot",
    integrations: [redisSearchTelemetry()],
  },
});
```
