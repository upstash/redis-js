import { BitCountCommand } from "./bitcount.ts";
import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when key is not set", async (t) => {
  await t.step("returns 0", async () => {
    const key = newKey();
    const res = await new BitCountCommand(key).exec(client);
    assertEquals(res, 0);
  });
});

Deno.test("when key is set", async (t) => {
  await t.step("returns bitcount", async () => {
    const key = newKey();
    const value = "Hello World";
    await new SetCommand(key, value).exec(client);
    const res = await new BitCountCommand(key).exec(client);
    assertEquals(res, 43);
  });

  Deno.test("with start and end", async (t) => {
    await t.step("returns bitcount", async () => {
      const key = newKey();
      const value = "Hello World";
      await new SetCommand(key, value).exec(client);
      const res = await new BitCountCommand(key, 4, 8).exec(client);
      assertEquals(res, 22);
    });
  });
});
