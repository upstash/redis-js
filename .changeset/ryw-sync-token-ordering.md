---
"@upstash/redis": patch
---

Fix read-your-writes sending a stale `upstash-sync-token`

A read issued straight after a write travelled with the token from _before_ that
write, so the server was under no obligation to serve the write and
`readYourWrites` silently did not hold.

`HttpClient.request()` snapshotted the outgoing headers with
`mergeHeaders(this.headers, ...)` and only afterwards wrote the freshest token into
`this.headers`, so the token learned from response N first shipped with request
N+2. The assignment now happens before the merge.

This regressed in **1.34.5**. In 1.34.0–1.34.4 the request options held
`headers: this.headers` by reference, so the late write was still picked up before
`fetch`; 1.34.5 introduced per-request header merging, which turned that reference
into a copy without moving the assignment.
