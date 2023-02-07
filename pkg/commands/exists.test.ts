import { keygen, newHttpClient } from "../test-utils.ts";
import { ExistsCommand } from "./exists.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when the key does not eist", async (t) => {
  await t.step("it returns 0", async () => {
    const key = newKey();

    const res = await new ExistsCommand([key]).exec(client);
    assertEquals(res, 0);
  });
});
Deno.test("when the key exists", async (t) => {
  await t.step("it returns 1", async () => {
    const key = newKey();
    await new SetCommand([key, "value"]).exec(client);
    const res = await new ExistsCommand([key]).exec(client);
    assertEquals(res, 1);
  });
});
Deno.test("with multiple keys", async (t) => {
  await t.step("it returns the number of found keys", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const key3 = newKey();
    await new SetCommand([key1, "value"]).exec(client);
    await new SetCommand([key2, "value"]).exec(client);
    const res = await new ExistsCommand([key1, key2, key3]).exec(client);
    assertEquals(res, 2);
  });
});
