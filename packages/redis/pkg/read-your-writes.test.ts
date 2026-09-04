import { keygen, newHttpClient } from "./test-utils";

import { afterAll, describe, expect, test } from "bun:test";

import { Redis as PublicRedis } from "../platforms/nodejs";
import { GetCommand } from "./commands/get";
import { SetCommand } from "./commands/set";
import { Redis } from "./redis";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe("Read Your Writes Feature", () => {
  test("successfully retrieves Upstash-Sync-Token in the response header and updates local state", async () => {
    const initialSync = client.upstashSyncToken;
    await new SetCommand(["key", "value"]).exec(client);
    const updatedSync = client.upstashSyncToken;
    await new SetCommand(["key", "value"]).exec(client);

    expect(updatedSync).not.toEqual(initialSync);
  });

  /**
   * Every other test here asserts the token the client *stored* after a response. None of them
   * asserted the token it actually *sends*, which is the half read-your-writes depends on — so this
   * captures the outgoing `upstash-sync-token` header instead.
   *
   * `request()` snapshots the outgoing headers with `mergeHeaders(this.headers, ...)` and only then
   * writes the freshest token into `this.headers`, so the write lands one request too late: the read
   * that follows a write travels without the token that proves the write happened.
   */
  test("sends the token from the write on the request that follows it", async () => {
    const key = newKey();
    const sentTokens: (string | null)[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = ((input: Parameters<typeof realFetch>[0], init?: RequestInit) => {
      sentTokens.push(new Headers(init?.headers).get("upstash-sync-token"));
      return realFetch(input, init);
    }) as typeof globalThis.fetch;

    try {
      await new SetCommand([key, "value"]).exec(client);
      // The token the server handed back for the write — the position a subsequent read must be
      // able to observe.
      const tokenFromWrite = client.upstashSyncToken;

      await new GetCommand([key]).exec(client);

      expect(sentTokens).toHaveLength(2);
      expect(sentTokens[1]).toBe(tokenFromWrite);
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  test("succesfully updates sync state with pipeline", async () => {
    const initialSync = client.upstashSyncToken;

    const { pipeline } = new Redis(client);
    const p = pipeline();

    p.set("key1", "value1");
    p.set("key2", "value2");
    p.set("key3", "value3");

    await p.exec();

    const updatedSync = client.upstashSyncToken;

    expect(initialSync).not.toEqual(updatedSync);
  });

  test("updates after each element of promise.all", async () => {
    let currentSync = client.upstashSyncToken;

    const promises = Array.from({ length: 3 }, (_, i) =>
      new SetCommand([`key${i}`, `value${i}`]).exec(client).then(() => {
        expect(client.upstashSyncToken).not.toEqual(currentSync);
        currentSync = client.upstashSyncToken;
      })
    );

    await Promise.all(promises);
  });

  test("updates after successful lua script call", async () => {
    const s = `redis.call('SET', 'mykey', 'myvalue')
		return 1
		`;

    const initialSync = client.upstashSyncToken;

    const redis = new Redis(client);
    const script = redis.createScript(s);

    await script.exec([], []);

    const updatedSync = client.upstashSyncToken;

    expect(updatedSync).not.toEqual(initialSync);
  });

  test("should not update the sync state in case of Redis client with manuel HTTP client and opt-out ryw", async () => {
    const optOutClient = newHttpClient();
    const redis = new Redis(optOutClient, { readYourWrites: false });

    const initialSync = optOutClient.upstashSyncToken;

    await redis.set("key", "value");

    const updatedSync = optOutClient.upstashSyncToken;

    expect(updatedSync).toEqual(initialSync);
  });

  test("should not update the sync state when public Redis interface is provided with opt-out", async () => {
    const redis = new PublicRedis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      readYourWrites: false,
    });

    // @ts-expect-error - We need the sync token for this test, which resides on the client
    const initialSync = redis.client.upstashSyncToken;

    await redis.set("key", "value");

    // @ts-expect-error - We need the sync token for this test, which resides on the client
    const updatedSync = redis.client.upstashSyncToken;

    expect(updatedSync).toEqual(initialSync);
  });

  test("should update the sync state when public Redis interface is provided with default behaviour", async () => {
    const redis = new PublicRedis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // @ts-expect-error - We need the sync token for this test, which resides on the client
    const initialSync = redis.client.upstashSyncToken;

    await redis.set("key", "value");

    // @ts-expect-error - We need the sync token for this test, which resides on the client
    const updatedSync = redis.client.upstashSyncToken;
    expect(updatedSync).not.toEqual(initialSync);
  });

  test("should updat read your writes sync token using set/get", async () => {
    const redis = new PublicRedis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // should change from "" to string
    expect(redis.readYourWritesSyncToken).toBe("");
    await redis.set("key", "value");
    expect(redis.readYourWritesSyncToken).not.toBe("");
    expect(typeof redis.readYourWritesSyncToken).toBe("string");

    // should change after set
    const syncToken = redis.readYourWritesSyncToken;
    await redis.set("key", "value");
    expect(syncToken).not.toBe(redis.readYourWritesSyncToken);

    // should be able to set
    const newSyncToken = "my-new-sync-token";
    redis.readYourWritesSyncToken = newSyncToken;
    expect(redis.readYourWritesSyncToken).toBe(newSyncToken);

    await redis.set("key", "value");
  });
});
