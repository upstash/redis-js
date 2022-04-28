import { BitOpCommand } from "./bitop.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when key is not set", async (t) => {
  await t.step("returns 0", async () => {
    const source = newKey();
    const dest = newKey();
    const res = await new BitOpCommand("and", dest, source).exec(client);
    assertEquals(res, 0);
  });
});

Deno.test("when key is set", async (t) => {
  await t.step("not", async (t) => {
    await t.step("inverts all bits", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand(source, sourcevalue).exec(client);
      await new SetCommand(dest, destValue).exec(client);
      const res = await new BitOpCommand("not", dest, source).exec(client);
      assertEquals(res, 11);
    });
  });
  await t.step("and", async (t) => {
    await t.step("works", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand(source, sourcevalue).exec(client);
      await new SetCommand(dest, destValue).exec(client);
      const res = await new BitOpCommand("and", dest, source).exec(client);
      assertEquals(res, 11);
    });
  });
});
