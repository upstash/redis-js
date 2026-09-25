import { afterEach, describe, expect, test } from "bun:test";
import { keygen, newHttpClient, randomID } from "../../test-utils";
import { XAddCommand } from "../xadd";
import { XDelCommand } from "../xdel";
import { Redis } from "../../redis";
import { createIndex, initIndex } from "./search";
import { s } from "./schema-builder";

const client = newHttpClient();
const { newKey, cleanup } = keygen();

// Each test creates at most one index at a time and drops it afterwards.
const createdIndexes: string[] = [];
afterEach(async () => {
  for (const name of createdIndexes) {
    try {
      await initIndex(client, { name }).drop();
    } catch {
      // already dropped
    }
  }
  createdIndexes.length = 0;
  await cleanup();
});

const schema = s.object({
  message: s.string(),
  severity: s.number("U64"),
  service: s.keyword(),
});

// Never called: these only exist so tsc verifies the stream-index parameter types.
const createStreamIndexWithPrefix = () =>
  createIndex(
    client,
    // @ts-expect-error prefix is not allowed for stream indexes
    { name: "never", schema, dataType: "stream", stream: "events", prefix: "events:" }
  );
const createStreamIndexWithoutStream = () =>
  createIndex(
    client,
    // @ts-expect-error stream is required for stream indexes
    { name: "never", schema, dataType: "stream" }
  );

function newIndexName() {
  const name = `test-stream-${randomID().slice(0, 8)}`;
  createdIndexes.push(name);
  return name;
}

describe("stream search index", () => {
  test("indexes stream entries and returns entry IDs as keys", async () => {
    const stream = newKey();
    const index = await createIndex(client, {
      name: newIndexName(),
      schema,
      dataType: "stream",
      stream,
    });

    await new XAddCommand([
      stream,
      "1-0",
      { message: "Payment authorization failed", severity: 4, service: "checkout" },
    ]).exec(client);
    await new XAddCommand([
      stream,
      "2-0",
      { message: "Order completed", severity: 1, service: "checkout" },
    ]).exec(client);
    await index.waitIndexing();

    const results = await index.query({
      filter: { message: "authorization", severity: { $gte: 3 } },
    });
    expect(results).toEqual([
      expect.objectContaining({
        key: "1-0",
        data: { message: "Payment authorization failed", severity: 4, service: "checkout" },
      }),
    ]);

    const selected = await index.query({
      filter: { service: "checkout" },
      orderBy: { severity: "ASC" },
      select: { message: true },
    });
    expect(selected.map((r) => [r.key, r.data])).toEqual([
      ["2-0", { message: "Order completed" }],
      ["1-0", { message: "Payment authorization failed" }],
    ]);

    expect(await index.count({ filter: { service: "checkout" } })).toEqual({ count: 2 });
  });

  test("describe reports the stream data type and key", async () => {
    const stream = newKey();
    const name = newIndexName();
    const index = await createIndex(client, { name, schema, dataType: "stream", stream });

    const description = await index.describe();
    expect(description?.name).toBe(name);
    expect(description?.dataType).toBe("stream");
    expect(description?.prefixes).toEqual([stream]);
    expect(description?.schema).toEqual({
      message: { type: "TEXT" },
      severity: { type: "U64", fast: true },
      service: { type: "KEYWORD" },
    });
  });

  test("removes documents for deleted entries", async () => {
    const stream = newKey();
    const index = await createIndex(client, {
      name: newIndexName(),
      schema,
      dataType: "stream",
      stream,
    });

    const id = await new XAddCommand([
      stream,
      "*",
      { message: "to be deleted", severity: 2, service: "api" },
    ]).exec(client);
    await index.waitIndexing();
    expect(await index.count({ filter: { service: "api" } })).toEqual({ count: 1 });

    await new XDelCommand([stream, id as string]).exec(client);
    await index.waitIndexing();
    expect(await index.count({ filter: { service: "api" } })).toEqual({ count: 0 });
  });

  test("skipInitialScan ignores entries that already exist", async () => {
    const stream = newKey();
    await new XAddCommand([stream, "1-0", { message: "old", severity: 1, service: "a" }]).exec(
      client
    );

    const index = await createIndex(client, {
      name: newIndexName(),
      schema,
      dataType: "stream",
      stream,
      skipInitialScan: true,
    });
    await new XAddCommand([stream, "2-0", { message: "new", severity: 1, service: "a" }]).exec(
      client
    );
    await index.waitIndexing();

    const results = await index.query({ filter: { service: "a" } });
    expect(results.map((r) => r.key)).toEqual(["2-0"]);
  });

  test("is available through redis.search.createIndex", async () => {
    const redis = new Redis(client);
    const stream = newKey();
    const index = await redis.search.createIndex({
      name: newIndexName(),
      schema,
      dataType: "stream",
      stream,
      existsOk: true,
    });

    await redis.xadd(stream, "*", { message: "hello", severity: 1, service: "web" });
    await index.waitIndexing();
    expect(await index.count({ filter: { service: "web" } })).toEqual({ count: 1 });
  });

  test("types: stream indexes take a stream key instead of a prefix", () => {
    // compile-time checks only, see createStreamIndexWithPrefix / createStreamIndexWithoutStream
    expect(typeof createStreamIndexWithPrefix).toBe("function");
    expect(typeof createStreamIndexWithoutStream).toBe("function");
  });
});
