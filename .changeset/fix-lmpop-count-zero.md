---
"@upstash/redis": patch
---

Fix `lmpop` dropping `COUNT` when `count` is 0, which made it pop one element
