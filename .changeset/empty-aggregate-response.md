---
"@upstash/redis": patch
---

Fix `search.index().aggregate()` crashing on an empty result set. An aggregation that matches no documents comes back as `null` from Redis, which previously threw a `TypeError` while parsing. It now returns an empty result object, matching the null-handling already in `query()` and `describe()`.
