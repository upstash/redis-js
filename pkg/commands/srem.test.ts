import { keygen, newHttpClient } from "../test-utils.ts";

import { SAddCommand } from "./sadd.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SRemCommand } from "./srem.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the number of removed members", async () => {
  const key = newKey();
  const value1 = crypto.randomUUID();
  const value2 = crypto.randomUUID();
  await new SAddCommand(key, value1, value2).exec(client);
  const res = await new SRemCommand(key, value1).exec(client);
  assertEquals(res, 1);
});
