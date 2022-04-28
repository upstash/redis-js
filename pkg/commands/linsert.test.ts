import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LInsertCommand } from "./linsert.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("adds the element", async () => {
  const key = newKey();
  const value1 = crypto.randomUUID();
  const value2 = crypto.randomUUID();

  await new LPushCommand(key, value1).exec(client);
  const res = await new LInsertCommand(key, "before", value1, value2).exec(
    client,
  );
  assertEquals(res, 2);
});
