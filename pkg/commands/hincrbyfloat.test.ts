import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { HIncrByFloatCommand } from "./hincrbyfloat.ts";
import { HSetCommand } from "./hset.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("a", async (t) => {
  await t.step("increments a non-existing value", async () => {
    const key = newKey();
    const field = randomID();
    const res = await new HIncrByFloatCommand([key, field, 2.5]).exec(client);

    assertEquals(res, 2.5);
  });

  await t.step("increments and existing value", async () => {
    const key = newKey();
    const field = randomID();
    await new HSetCommand([key, { [field]: 5 }]).exec(client);
    const res = await new HIncrByFloatCommand([key, field, 2.5]).exec(client);

    assertEquals(res, 7.5);
  });
});
