import { AppendCommand } from "./append.ts";
import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when key is not set", async (t) => {
  await await t.step("appends to empty value", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    const res = await new AppendCommand(key, value).exec(client);
    assertEquals(res, value.length);
  });
});

Deno.test("when key is set", async (t) => {
  await await t.step("appends to existing value", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    const res = await new AppendCommand(key, value).exec(client);
    assertEquals(res, value.length);
    const res2 = await new AppendCommand(key, "_").exec(client);
    assertEquals(res2, value.length + 1);
  });
});
