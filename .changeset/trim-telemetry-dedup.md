---
"@upstash/redis": patch
---

Trim telemetry header values before deduplicating so whitespace around existing values does not defeat the dedup check
