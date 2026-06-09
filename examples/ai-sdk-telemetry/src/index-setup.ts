import { redis, INDEX_NAME, EVENT_PREFIX, telemetrySchema } from "./redis";

// Run once. The index auto-synchronizes: after it exists, every write to a key
// under `ai:event:` is tracked automatically. There is no `index.add()` /
// `index.upsert()` — you write JSON with `redis.json.set` and the index follows.
export async function createTelemetryIndex() {
  return redis.search.createIndex({
    name: INDEX_NAME,
    prefix: EVENT_PREFIX,
    dataType: "json",
    existsOk: true, // safe to call repeatedly
    schema: telemetrySchema,
  });
}
