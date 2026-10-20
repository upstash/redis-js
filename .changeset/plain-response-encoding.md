---
"@upstash/redis": minor
---

Default `responseEncoding` to `false`. The server returns string values as plain JSON instead of base64, which cuts response sizes by up to 25%. Set `responseEncoding: "base64"` to keep the previous behavior. String values that start with a UTF-8 BOM now keep it.
