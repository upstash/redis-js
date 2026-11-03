---
"@upstash/redis": minor
---

Search types now accept exactly what the server accepts, checked by live conformance tests:

- Fix: `$mustNot` next to `$must`, `$and` next to `$must`, and `$boost: { query, value }` are accepted.
- Add `$dateHistogram`, `$composite`, and the missing options of `$terms`, `$histogram`, `$range`, `$sum`, `$count`, `$cardinality` and `$facet`.
- Fix `$composite` pagination: `afterKey` is an object that can be passed as `after`. Fix `keyed: true` buckets.
- Numeric fields are always created `FAST`, the same as `s.number()`, so a plain `"F64"` field can be sorted.
- Reject at compile time what the server rejects: sorting or scoring by fields that cannot be sorted, aggregations on unsupported field types, retriever misuse inside `$rrf`, `$or` next to `$must` or a field, unknown options, and more.
