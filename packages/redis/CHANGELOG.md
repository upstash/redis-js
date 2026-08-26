# @upstash/redis

## 1.38.3

### Patch Changes

- f020866: Send an `Upstash-Telemetry-Retry` header with the retry count on retried requests so retry rates are visible in server-side telemetry
- 777dc30: Trim telemetry header values before deduplicating so whitespace around existing values does not defeat the dedup check

## 1.38.2

### Patch Changes

- c0f5ad7: Deduplicate telemetry header values so repeated `mergeTelemetry` calls no longer append the same sdk, platform or runtime tag multiple times

## 1.38.1

### Patch Changes

- bd7a19f: Add a quick tip about creating a database via https://upstash.com/start-redis to the warnings shown when the Redis url or token is missing. On Cloudflare, the warning shown when both the url and the token are missing now names both `wrangler secret put` commands instead of only one.

## 1.38.0

### Minor Changes

- c71f581: Separate read/write commands into separate pipelines in auto pipeline. As a
  result, mixed read/write `Promise.all` batches may now be split across multiple
  pipeline HTTP requests instead of a single request, and read-after-write
  ordering may no longer be preserved within those mixed batches.

## 1.37.0

### Minor Changes

- 6f2a831: Release redis search

### Patch Changes

- 3980b45: Add monorepo structure
