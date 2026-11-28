---
"@upstash/redis": patch
---

Fix sorted set scores such as `0.1`, `1e+20` or `inf` being returned as strings instead of numbers
