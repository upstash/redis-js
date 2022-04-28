import { Command } from "./command.ts";
import { keygen, newHttpClient } from "../test-utils.ts";

import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("deserialize large numbers", async (t) => {
  await t.step("returns the correct number", async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    const value = "101600000000150081467";

    await new Command(["hset", key, field, value]).exec(client);

    const res = await new Command(["hget", key, field]).exec(client);
    assertEquals(res, value);
  });
});
