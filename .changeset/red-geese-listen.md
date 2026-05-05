---
"@upstash/redis": minor
---

Separate read/write commands into separate pipelines in auto pipeline. As a
result, mixed read/write `Promise.all` batches may now be split across multiple
pipeline HTTP requests instead of a single request, and read-after-write
ordering may no longer be preserved within those mixed batches.
