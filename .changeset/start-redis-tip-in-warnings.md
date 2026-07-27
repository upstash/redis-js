---
"@upstash/redis": patch
---

Add a quick tip about creating a database via https://upstash.com/start-redis to the warnings shown when the Redis url or token is missing. On Cloudflare, the warning shown when both the url and the token are missing now names both `wrangler secret put` commands instead of only one.
