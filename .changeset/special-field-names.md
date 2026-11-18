---
"@upstash/redis": patch
---

Fix fields with names like `constructor` missing from hash, stream and search results

A field named `__proto__` is now returned as a regular field of the result. If you copy a result into another object, use object spread (`{ ...result }`). `Object.assign` and hand-written deep merges treat a field with that name specially.

In search results, a field named `$`, or starting with `$.`, is returned as a regular field.
