# @upstash/redis

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
