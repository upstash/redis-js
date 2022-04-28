import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetAllCommand } from "./hgetall.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("returns all fields", async () => {
  const key = newKey();
  const field2 = crypto.randomUUID();
  const field1 = crypto.randomUUID();
  const value1 = false;
  const value2 = crypto.randomUUID();
  await new HSetCommand(key, { [field1]: value1, [field2]: value2 }).exec(
    client,
  );

  const res = await new HGetAllCommand(key).exec(client);

  const obj = { [field1]: value1, [field2]: value2 };
  assertEquals(res, obj);
});
Deno.test("when hash does not exist", async (t) => {
  await t.step("it returns null", async () => {
    const res = await new HGetAllCommand(crypto.randomUUID()).exec(client);
    assertEquals(res, null);
  });
});
