# Vector Indexes

## Overview

A vector index stores embeddings under string IDs inside Redis and answers approximate nearest-neighbour queries. It lives at an ordinary Redis key (`EXISTS`, `EXPIRE`, `DEL` work on it). This is the `VECTOR.*` command family of Upstash Redis, which is separate from the standalone Upstash Vector database and its `@upstash/vector` SDK (see the `upstash-vector-js` skill).

## Good For

- Semantic search or RAG next to data already in Redis, without another service
- Semantic caching of LLM responses
- Small to medium embedding sets that share a Redis database's lifecycle

Prefer Upstash Vector (`@upstash/vector`) for metadata filtering, namespaces, hybrid/sparse search, or built-in embedding models.

## Examples

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// dimension (1-32768) and metric are fixed for the life of the index
const index = await redis.vector.createIndex({
  name: "docs",
  dimension: 1536,
  metric: "COSINE", // COSINE | EUCLIDEAN | DOT
  existsOk: true, // idempotent start-up path
});

// Handle to an existing index, no round trip
const same = redis.vector.index("docs");

// Upsert: 1 = added, 0 = replaced
await index.add("doc-1", embedding); // number[]
await index.add("doc-2", new Float32Array(embedding)); // sent as base64 FP32
await index.add("doc-3", { base64: openAiBase64Embedding }); // encoding_format: "base64"

// Nearest neighbours, best first. Scores are normalized to 0..1 for every metric.
const hits = await index.query({ vector: queryEmbedding, topK: 5, profile: "PRECISE" });
// [{ id: "doc-1", score: 0.93 }, ...]

await index.get("doc-1"); // number[] (float32 precision) | null
await index.count(); // 3
await index.info(); // { dimension: 1536, metric: "COSINE" } | null if missing
await index.delete("doc-1"); // 1 | 0
await index.drop(); // 1 | 0
```

## Common Mistakes

- Importing `@upstash/vector` for these commands. They are part of `@upstash/redis` and use the Redis REST URL and token.
- Changing `dimension` or `metric` on an existing index. Drop and recreate it instead.
- Comparing `get()` output to the original embedding exactly. Values are stored as 32-bit floats.
- Expecting `redis.pipeline()` or `redis.multi()` to batch vector commands. Like search, the vector namespace is not available on pipelines: every call is its own request, so bulk loads should be chunked and run with `Promise.all` instead.
- Checking existence with `count()`. It returns `0` for both a missing and an empty index; `info()` returns `null` only when the index is missing.
