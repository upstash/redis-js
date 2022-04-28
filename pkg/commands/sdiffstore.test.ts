import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SDiffStoreCommand } from "./sdiffstore.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the diff", async () => {
  const key1 = newKey();
  const member1 = crypto.randomUUID();
  const key2 = newKey();
  const member2 = crypto.randomUUID();
  const destination = newKey();
  await new SAddCommand(key1, member1).exec(client);
  await new SAddCommand(key2, member2).exec(client);
  const res = await new SDiffStoreCommand(destination, key1, key2).exec(client);
  assertEquals(res, 1);
});
