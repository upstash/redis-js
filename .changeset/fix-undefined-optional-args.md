---
"@upstash/redis": patch
---

Fix `lpop`, `rpop`, `pexpire`, `expireat` and `pexpireat` failing when the optional `count` or `option` argument is passed as `undefined`
