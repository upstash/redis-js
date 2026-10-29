---
"@upstash/redis": patch
---

Honor `retry: false` by sending only the initial HTTP request. Previously, a network failure could replay a command or pipeline once even when retries were disabled.
