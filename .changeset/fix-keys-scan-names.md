---
"@upstash/redis": patch
---

`keys()` and `scan()` return key names as Redis gives them. Before, a key name that is valid JSON was parsed: the key `"draft"` came back as `draft`, and the key `123` came back as the number `123`.
