---
"@upstash/redis": patch
---

Fix auto-pipelining returning another command's result (or throwing `TypeError: ... commandResult.error`) after a command threw while it was being built, for example a value with a BigInt that JSON.stringify cannot serialize, or an unbalanced `xread`. The failed command no longer reserves a result slot in the pipeline.
