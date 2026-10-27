---
"@upstash/redis": minor
---

Support hybrid search: `s.hybrid()` declares a `HYBRID` field, and `query()` accepts the `$ann`, `$rrf` and `$standard` retrievers. `count()` and `aggregate()` accept `$rrf` and `$standard` without `$ann`.
