import type {
  TelemetryIntegration,
  OnFinishEvent,
  OnToolCallFinishEvent,
} from "ai";
import { bindTelemetryIntegration } from "ai";
import { redis, EVENT_PREFIX, TTL_SECONDS } from "./redis";

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

// @upstash/redis is HTTP-based: each json.set + expire is two round trips.
// On a hot streaming path we don't want to pay that per hook, so we buffer
// every event produced during one generation and flush them all in a single
// pipeline at onFinish. Create one instance per call (the factory does this)
// so each generation owns its own buffer.
class RedisSearchTelemetry implements TelemetryIntegration {
  private buffer: TelemetryDoc[] = [];

  onToolCallFinish(event: OnToolCallFinishEvent) {
    this.buffer.push({
      type: "toolCall",
      toolName: event.toolCall.toolName,
      functionId: event.functionId,
      model: event.model?.modelId,
      success: event.success,
      durationMs: event.durationMs,
      ts: new Date().toISOString(),
    });
  }

  async onFinish(event: OnFinishEvent) {
    this.buffer.push({
      type: "generation",
      functionId: event.functionId ?? "unknown",
      model: event.model?.modelId ?? "unknown",
      finishReason: event.finishReason,
      totalTokens: event.totalUsage.totalTokens ?? 0,
      inputTokens: event.totalUsage.inputTokens ?? 0,
      outputTokens: event.totalUsage.outputTokens ?? 0,
      ts: new Date().toISOString(),
    });

    await this.flush();
  }

  // One round trip for the whole generation (all tool calls + the generation
  // doc). No waitIndexing() here — indexing is batched and waiting would add
  // latency to every generation. Wait once on the read path instead.
  private async flush() {
    if (this.buffer.length === 0) return;

    const pipeline = redis.pipeline();
    for (const doc of this.buffer) {
      const key = `${EVENT_PREFIX}${crypto.randomUUID()}`;
      pipeline.json.set(key, "$", doc);
      pipeline.expire(key, TTL_SECONDS);
    }
    this.buffer = [];
    await pipeline.exec();
  }
}

// bindTelemetryIntegration keeps `this` bound when the SDK extracts the hooks
// as bare callbacks. Returns a fresh instance — one buffer per generation.
export function redisSearchTelemetry(): TelemetryIntegration {
  return bindTelemetryIntegration(new RedisSearchTelemetry());
}
