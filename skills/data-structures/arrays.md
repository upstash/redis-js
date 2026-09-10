# Arrays

## Overview

Arrays store values under unsigned integer indexes (`0` to `2^64 - 2`). They are sparse: writing to index 1,000,000 does not allocate the slots before it, and deleting a value leaves a hole instead of shifting later values. Each array also has an append cursor used by `arinsert` and `arring`.

## Good For

- Data with a natural numeric key (sequence numbers, bucketed timestamps)
- Append-only logs addressed by position
- Fixed-size ring buffers (last N samples or log lines)
- Server-side aggregates over a window of numeric samples

## Examples

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Positional writes (do NOT move the append cursor)
await redis.arset("readings", 0, 21.5, 21.7, 22.1); // 3 = newly occupied slots
await redis.armset("readings", { 100: 19.8, 200: 20.4 });

// Appends continue after the cursor; the reply is the index of the last value
await redis.arinsert("log", "boot", "ready"); // 1
await redis.arnext("log"); // 2, where the next append lands

// Reads
await redis.arget("readings", 0); // 21.5
await redis.armget("readings", 0, 50, 100); // [21.5, null, 19.8]
await redis.argetrange("readings", 0, 3); // [21.5, 21.7, 22.1, null], one entry per index
await redis.arscan("readings", 0, 1000, { limit: 10 }); // [[0, 21.5], [1, 21.7], ...] occupied slots only

// Search values ("-" / "+" = whole array)
await redis.argrep("log", "-", "+", { predicates: [{ match: "boot" }] }); // [0]
await redis.argrep("log", "-", "+", {
  predicates: [{ glob: "err*" }, { re: "^warn" }], // OR by default, combine: "AND" for all
  noCase: true,
  withValues: true, // [[index, value], ...]
});

// Aggregate on the server: SUM | MIN | MAX | AND | OR | XOR | USED | { match }
await redis.arop("readings", 0, 999, "SUM"); // 105.5, or null if nothing numeric

// Ring buffer of the last 100 events, read back oldest-first
await redis.arring("recent", 100, "event-a", "event-b");
await redis.arlastitems("recent", 10); // add { rev: true } for newest-first

// Size: arcount = stored values, arlen = highest index + 1
await redis.arcount("readings"); // 5
await redis.arlen("readings"); // 201

// Delete (leaves holes)
await redis.ardel("readings", 0, 1);
await redis.ardelrange("readings", [100, 199], [200, 299]);
```

## Common Mistakes

- `arset` does not move the append cursor. An `arinsert` after `arset` on a fresh key writes to index `0` and overwrites it. Use one style per array, or `arseek` the cursor first.
- `arlen` is not the number of values in a sparse array; use `arcount`.
- `argetrange` returns one element per index (nulls for holes) and rejects ranges over 1,000,000 indexes. Use `arscan` for sparse ranges.
