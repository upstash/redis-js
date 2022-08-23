import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SInterCommand } from "./sinter.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("with single set", async (t) => {
  await t.step("returns the members of the set", async () => {
    const key = newKey();
    const value1 = { v: randomID() };
    const value2 = { v: randomID() };
    await new SAddCommand([key, value1, value2]).exec(client);
    const res = await new SInterCommand<{ v: string }>([key]).exec(client);
    assertEquals(res.length, 2);
    assertEquals(res.map(({ v }) => v).includes(value1.v), true);
    assertEquals(res.map(({ v }) => v).includes(value2.v), true);
  });
});

Deno.test("with multiple sets", async (t) => {
  await t.step("returns the members of the set", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const value1 = { v: randomID() };
    const value2 = { v: randomID() };
    const value3 = { v: randomID() };
    await new SAddCommand([key1, value1, value2]).exec(client);
    await new SAddCommand([key2, value2, value3]).exec(client);
    const res = await new SInterCommand<{ v: string }>([key1, key2]).exec(
      client,
    );
    assertEquals(res, [value2]);
  });
});
