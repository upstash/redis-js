import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { GetCommand } from "./get.ts";
import { PExpireAtCommand } from "./pexpireat.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { SetCommand } from "./set.ts";
import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
  });
});
Deno.test("without options", async (t) => {
  await t.step("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    const res = await new PExpireAtCommand([key, 1000]).exec(client);
    assertEquals(res, 1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand([key]).exec(client);
    assertEquals(res2, null);
  });
});
