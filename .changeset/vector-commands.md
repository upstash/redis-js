---
"@upstash/redis": minor
---

Add vector index support: `redis.vector.createIndex()` / `redis.vector.index()` return a `VectorIndex` with `add`, `get`, `query`, `delete`, `count`, `info` and `drop`, backed by the new `VECTOR.CREATE`, `VECTOR.ADD`, `VECTOR.GET`, `VECTOR.QUERY`, `VECTOR.DEL`, `VECTOR.COUNT`, `VECTOR.INFO` and `VECTOR.DROP` commands. The same commands are available in pipelines and transactions under `pipeline.vector.*`.
