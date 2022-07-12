import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { RPopCommand } from "./rpop.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when list exists", async (t) => {
  await t.step("returns the first element", async () => {
    const key = newKey();
    const value = randomID();
    await new LPushCommand([key, value]).exec(client);
    const res = await new RPopCommand([key]).exec(client);
    assertEquals(res, value);
  });
});

Deno.test("when list does not exist", async (t) => {
  await t.step("returns null", async () => {
    const key = newKey();
    const res = await new RPopCommand([key]).exec(client);
    assertEquals(res, null);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns 2 elements", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new LPushCommand([key, value1, value2]).exec(client);
    const res = await new RPopCommand<string[]>([key, 2]).exec(client);
    assertExists(res);
    assertArrayIncludes(res, [value1, value2]);
  });
});
