---
"@upstash/redis": minor
---

Default `responseEncoding` to `false`. The server returns string values as plain JSON instead of base64, which cuts response sizes by up to 25%. Set `responseEncoding: "base64"` to keep the previous behavior. String values that start with a UTF-8 BOM now keep it, and a nested `OK` status reply (e.g. a Lua script returning `{redis.call("SET", ...)}`) no longer sometimes decodes to `8`. Error replies nested in arrays (e.g. Lua `pcall` results) are no longer garbled.
