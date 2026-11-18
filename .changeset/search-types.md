---
"@upstash/redis": minor
---

Search types now match what the server accepts, checked by live conformance tests:

- Fix: `$mustNot` next to `$must`, `$and` next to `$must`, and `$boost: { query, value }` are accepted.
- Add `$dateHistogram`, `$composite`, and the missing options of `$terms`, `$histogram`, `$range`, `$sum`, `$count`, `$cardinality` and `$facet`.
- Fix `$composite` pagination: `afterKey` is an object that can be passed as `after`. Fix `keyed: true` buckets, including empty ones.
- Reject at compile time what the server rejects: sorting, scoring, highlighting or aggregating by fields that are not `FAST` or have the wrong type, `$facet` as a sub-aggregation, retriever misuse inside `$rrf`, and unknown options.
- Aggregation results: `keyed` given as a `boolean` gives both bucket shapes, `$sum` with `nullIfNoMatch` can be `null`, and `docCountErrorUpperBound` is optional when `$terms` has `order`.
- `SearchIndex<FlatIndexSchema>` accepts any field name, and options accept `undefined` under `exactOptionalPropertyTypes`.
- Reject `$or` next to a `$boost: { query, value }` object, where it only adds to the score and stops filtering, as it already was next to a field or `$must`.
