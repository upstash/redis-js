import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { LTrimCommand } from "./ltrim.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when the list exists", async (t) => {
  await t.step("returns ok", async () => {
    const key = newKey();
    await new LPushCommand([key, randomID()]).exec(client);
    await new LPushCommand([key, randomID()]).exec(client);
    await new LPushCommand([key, randomID()]).exec(client);
    const res = await new LTrimCommand([key, 1, 2]).exec(client);
    assertEquals(res, "OK");
  });
});

Deno.test("when the list does not exist", async (t) => {
  await t.step("returns ok", async () => {
    const key = newKey();

    const res = await new LTrimCommand([key, 1, 2]).exec(client);
    assertEquals(res, "OK");
  });
});
