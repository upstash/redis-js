import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { FlushDBCommand } from "./flushdb";
import { ScanCommand } from "./scan";
import { SetCommand } from "./set";
import { TypeCommand } from "./type";
import { ZAddCommand } from "./zadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("without options", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== 0);
    expect(found.includes(key)).toBeTrue();
  });
});

test("with match", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { match: key }]).exec(client);
      expect(typeof res[0]).toEqual("number");
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== 0);

    expect(found).toEqual([key]);
  });
});

test("with count", () => {
  test("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { count: 1 }]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== 0);

    expect(found.includes(key)).toEqual(true);
  });
});

test("with type", () => {
  test("returns cursor and keys", async () => {
    await new FlushDBCommand([]).exec(client);
    const key1 = newKey();
    const key2 = newKey();
    const value = randomID();
    await new SetCommand([key1, value]).exec(client);

    // Add a non-string type
    await new ZAddCommand([key2, { score: 1, member: "abc" }]).exec(client);

    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { type: "string" }]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor !== 0);

    expect(found.length).toEqual(1);
    for (const key of found) {
      const type = await new TypeCommand([key]).exec(client);
      expect(type).toEqual("string");
    }
  });
});
