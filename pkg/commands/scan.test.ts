import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { FlushDBCommand } from "./flushdb";
import type { ScanResultWithType } from "./scan";
import { ScanCommand } from "./scan";
import { SetCommand } from "./set";
import { TypeCommand } from "./type";
import { ZAddCommand } from "./zadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe("without options", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    let cursor = "0";
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== "0");
    expect(found.includes(key)).toBeTrue();
  });
});

describe("with match", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = "0";
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { match: key }]).exec(client);
      expect(typeof res[0]).toEqual("string");
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== "0");

    expect(found).toEqual([key]);
  });
});

describe("with count", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = "0";
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { count: 1 }]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== "0");

    expect(found.includes(key)).toEqual(true);
  });
});

describe("with type", () => {
  test("returns cursor and keys", async () => {
    await new FlushDBCommand([]).exec(client);
    const key1 = newKey();
    const key2 = newKey();
    const value = randomID();
    await new SetCommand([key1, value]).exec(client);

    // Add a non-string type
    await new ZAddCommand([key2, { score: 1, member: "abc" }]).exec(client);

    let cursor = "0";
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { type: "string" }]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== "0");

    expect(found.length).toEqual(1);
    for (const key of found) {
      const type = await new TypeCommand([key]).exec(client);
      expect(type).toEqual("string");
    }
  });
});

describe("with withType", () => {
  test("returns cursor and keys with types", async () => {
    await new FlushDBCommand([]).exec(client);
    const stringKey = newKey();
    const zsetKey = newKey();
    const value = randomID();

    // Add different types of keys
    await new SetCommand([stringKey, value]).exec(client);
    await new ZAddCommand([zsetKey, { score: 1, member: "abc" }]).exec(client);

    // Scan with WITHTYPE option
    let cursor = "0";
    let foundStringKey;
    let foundZsetKey;

    do {
      // Use the generic type parameter to specify the return type
      const res = await new ScanCommand<ScanResultWithType>([cursor, { withType: true }]).exec(
        client
      );

      cursor = res[0];
      const items = res[1];

      // Find our test keys in the results
      if (!foundStringKey) {
        foundStringKey = items.find((item) => item.key === stringKey && item.type === "string");
      }

      if (!foundZsetKey) {
        foundZsetKey = items.find((item) => item.key === zsetKey && item.type === "zset");
      }
    } while (cursor !== "0");

    // Verify types are correct
    expect(foundStringKey).toBeDefined();
    expect(foundZsetKey).toBeDefined();
    expect(foundStringKey?.type).toEqual("string");
    expect(foundZsetKey?.type).toEqual("zset");
  });
});
