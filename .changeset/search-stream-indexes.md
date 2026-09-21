---
"@upstash/redis": minor
---

Support search indexes over Redis streams: `redis.search.createIndex({ dataType: "stream", stream: "events", schema })` indexes every entry of the stream as a document keyed by its entry ID. `describe()` reports `dataType: "stream"` with the stream key in `prefixes`.
