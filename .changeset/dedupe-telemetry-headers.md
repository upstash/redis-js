---
"@upstash/redis": patch
---

Deduplicate telemetry header values so repeated `mergeTelemetry` calls no longer append the same sdk, platform or runtime tag multiple times
