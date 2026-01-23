# Pipeline Optimization

## Overview

Pipelines batch multiple Redis commands into one HTTP request. Use automatic pipelines for Promise.all patterns, manual pipelines for sequential operations.

## Good For

- Multiple independent operations
- High-latency networks
- Serverless functions with cold starts
- Operations that don't depend on each other's results

## Limitations

- Commands in pipeline cannot depend on previous results
- Large pipelines increase memory usage
- Errors in one command don't stop others

## Examples

```typescript
import { Redis } from "@upstash/redis";

// Auto-pipeline: enable globally
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  enableAutoPipelining: true,
});

// With auto-pipeline: Promise.all batches automatically
const [user, posts, comments] = await Promise.all([
  redis.get("user:1"),
  redis.lrange("posts:1", 0, 9),
  redis.lrange("comments:1", 0, 9),
]);
// Single HTTP request!

// Manual pipeline: explicit control
const redisManu = Redis.fromEnv();
const pipeline = redisManu.pipeline();
pipeline.get("user:1");
pipeline.lrange("posts:1", 0, 9);
pipeline.lrange("comments:1", 0, 9);

const results = await pipeline.exec();

// When NOT to pipeline: dependent operations
// ❌ Bad: second operation depends on first
const bad = redis.pipeline();
bad.get("counter");
bad.incr("counter"); // Might not see previous get result
await bad.exec();

// ✅ Good: independent operations
const good = redis.pipeline();
good.get("user:1");
good.get("user:2");
good.get("user:3");
await good.exec();

// Pipeline size optimization
const OPTIMAL_SIZE = 50;

async function pipelinedBatch(operations: Array<() => any>) {
  const results = [];

  for (let i = 0; i < operations.length; i += OPTIMAL_SIZE) {
    const batch = operations.slice(i, i + OPTIMAL_SIZE);
    const pipeline = redis.pipeline();

    batch.forEach((op) => op());

    const batchResults = await pipeline.exec();
    results.push(...batchResults);
  }

  return results;
}

// Error handling in pipelines
try {
  const pipeline = redis.pipeline();
  pipeline.get("key1");
  pipeline.set("key2", "value");
  pipeline.get("invalid:key");

  const results = await pipeline.exec();

  // Check individual results
  results.forEach((result, i) => {
    if (result instanceof Error) {
      console.error(`Command ${i} failed:`, result);
    }
  });
} catch (error) {
  console.error("Pipeline failed:", error);
}

// Performance comparison
const keys = Array.from({ length: 100 }, (_, i) => `key:${i}`);

// Without pipeline: 100 HTTP requests
const start1 = Date.now();
for (const key of keys) {
  await redis.get(key);
}
const time1 = Date.now() - start1;
console.log("Individual:", time1, "ms");

// With pipeline: 1 HTTP request
const start2 = Date.now();
const pipeline2 = redis.pipeline();
keys.forEach((key) => pipeline2.get(key));
await pipeline2.exec();
const time2 = Date.now() - start2;
console.log("Pipeline:", time2, "ms");

// Mixed operations in pipeline
const mixed = redis.pipeline();
mixed.set("key1", "value1");
mixed.incr("counter");
mixed.lpush("queue", "job");
mixed.sadd("tags", "redis");
mixed.zadd("leaderboard", { score: 100, member: "user:1" });

await mixed.exec();

// Dynamic pipeline building
function buildPipeline(userIds: string[]) {
  const pipeline = redis.pipeline();

  userIds.forEach((id) => {
    pipeline.hgetall(`user:${id}:profile`);
    pipeline.lrange(`user:${id}:posts`, 0, 4);
    pipeline.zrevrank("leaderboard", id);
  });

  return pipeline;
}

const userPipeline = buildPipeline(["1", "2", "3"]);
const userResults = await userPipeline.exec();

// Best practice: use auto-pipeline for simple cases
const autoRedis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  enableAutoPipelining: true,
});

// Just use Promise.all - auto-batches
const data = await Promise.all([
  autoRedis.get("key1"),
  autoRedis.get("key2"),
  autoRedis.incr("counter"),
]);
```
