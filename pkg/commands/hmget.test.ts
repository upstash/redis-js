import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";

import { HMSetCommand } from "./hmset.ts";
import { HMGetCommand } from "./hmget.ts";
import { HSetCommand } from "./hset.ts";
const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("gets exiting values", async () => {
  const key = newKey();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
  const res = await new HMSetCommand([key, kv]).exec(client);

  assertEquals(res, "OK");
  const res2 = await new HMGetCommand([key, field1, field2]).exec(client);

  assertEquals(res2, kv);
});

Deno.test("when the hash does not exist", async (t) => {
  await t.step("returns null", async () => {
    const key = newKey();
    const res = await new HMGetCommand([key, randomID()]).exec(client);

    assertEquals(res, null);
  });
});

Deno.test("gets an object", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const cmd = new HMGetCommand([key, field]);
  const res = await cmd.exec(client);
  assertEquals(res, { [field]: value });
});
