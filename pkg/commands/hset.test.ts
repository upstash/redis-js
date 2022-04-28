import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("sets value", async () => {
  const key = newKey();
  const field = crypto.randomUUID();
  const value = crypto.randomUUID();

  const res = await new HSetCommand(key, { [field]: value }).exec(client);

  assertEquals(res, 1);
  const res2 = await new HGetCommand(key, field).exec(client);

  assertEquals(res2, value);
});
