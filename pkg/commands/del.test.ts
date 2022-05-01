import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { DelCommand } from "./del.ts";
import { SetCommand } from "./set.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when key does not exist", async (t) => {
  await t.step("does nothing", async () => {
    const key = newKey();

    const res = await new DelCommand([key]).exec(client);
    assertEquals(res, 0);
  });
});
Deno.test("when key does exist", async (t) => {
  await t.step("deletes the key", async () => {
    const key = newKey();
    await new SetCommand([key, "value"]).exec(client);
    const res = await new DelCommand([key]).exec(client);
    assertEquals(res, 1);
  });
});
Deno.test("with multiple keys", async (t) => {
  await t.step("when one does not exist", async (t) => {
    await t.step("deletes all keys", async () => {
      const key1 = newKey();
      const key2 = newKey();
      await new SetCommand([key1, "value"]).exec(client);
      const res = await new DelCommand([key1, key2]).exec(client);
      assertEquals(res, 1);
    });
  });
});
