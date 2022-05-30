import { BitPosCommand } from "./bitpos.ts";
import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when key is not set", async (t) => {
  await t.step("returns 0", async () => {
    const key = newKey();
    const res = await new BitPosCommand([key, 1, 1]).exec(client);
    assertEquals(res, -1);
  });
});

Deno.test("when key is set", async (t) => {
  await t.step("returns position of first set bit", async () => {
    const key = newKey();
    const value = "Hello World";
    await new SetCommand([key, value]).exec(client);
    const res = await new BitPosCommand([key, 2, 3]).exec(client);
    assertEquals(res, 24);
  });
});
