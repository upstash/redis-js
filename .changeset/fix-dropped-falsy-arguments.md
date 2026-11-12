---
"@upstash/redis": patch
---

Fix commands dropping valid zero or empty arguments: `expire` with 0 seconds, `geoadd` with a latitude of 0, `xtrim` with `limit: 0`, `xautoclaim` with `count: 0`, and `scan`, `hscan`, `sscan` and `zscan` with an empty `match`
