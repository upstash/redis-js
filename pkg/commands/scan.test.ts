import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { ZAddCommand } from "./zadd.ts";
import { ScanCommand } from "./scan.ts";
import { TypeCommand } from "./type.ts";
import { FlushDBCommand } from "./flushdb.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("without options", async (t) => {
  await t.step("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor]).exec(client);
      assertEquals(typeof res[0], "number");
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor != 0);
    assertEquals(found.includes(key), true);
  });
});

Deno.test("with match", async (t) => {
  await t.step("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { match: key }]).exec(client);
      assertEquals(typeof res[0], "number");
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor != 0);

    assertEquals(found, [key]);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns cursor and keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    let cursor = 0;
    const found: string[] = [];
    do {
      const res = await new ScanCommand([cursor, { count: 1 }]).exec(client);
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor != 0);

    assertEquals(found.includes(key), true);
  });
});

Deno.test("with type", async (t) => {
  await t.step("returns cursor and keys", async () => {
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
      const res = await new ScanCommand([cursor, { type: "string" }]).exec(
        client,
      );
      cursor = res[0];
      found.push(...res[1]);
    } while (cursor != 0);

    assertEquals(found.length, 1);
    for (const key of found) {
      const type = await new TypeCommand([key]).exec(client);
      assertEquals(type, "string");
    }
  });
});
