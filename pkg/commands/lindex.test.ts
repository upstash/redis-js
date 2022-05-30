import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { LIndexCommand } from "./lindex.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when list exists", async (t) => {
  await t.step("when the index is in range", async (t) => {
    await t.step("returns the element at index", async () => {
      const key = newKey();

      const value = randomID();
      await new LPushCommand([key, value]).exec(client);
      const res = await new LIndexCommand([key, 0]).exec(client);
      assertEquals(res, value);
    });
    await t.step("when the index is out of bounds", async (t) => {
      await t.step("returns null", async () => {
        const key = newKey();

        const value = randomID();
        await new LPushCommand([key, value]).exec(client);
        const res = await new LIndexCommand([key, 1]).exec(client);
        assertEquals(res, null);
      });
    });
  });
});
