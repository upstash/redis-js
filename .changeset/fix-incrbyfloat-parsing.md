---
"@upstash/redis": patch
---

Fix INCRBYFLOAT and HINCRBYFLOAT results such as `0.1` or `1e+20` being returned as strings instead of numbers
