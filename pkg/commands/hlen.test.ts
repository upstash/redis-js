import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { HMSetCommand } from "./hmset.ts";
import { HLenCommand } from "./hlen.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("with existing hash", async (t) => {
  await t.step("returns correct number of keys", async () => {
    const key = newKey();
    const field1 = randomID();
    const field2 = randomID();

    const kv: Record<string, string> = {};
    kv[field1] = randomID();
    kv[field2] = randomID();
    await new HMSetCommand([key, kv]).exec(client);
    const res = await new HLenCommand([key]).exec(client);
    assertEquals(res, 2);
  });
});
