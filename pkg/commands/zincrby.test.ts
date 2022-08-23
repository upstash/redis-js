import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { ZIncrByCommand } from "./zincrby.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { ZAddCommand } from "./zadd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("increments and existing value", async () => {
  const key = newKey();
  const score = 1;
  const member = randomID();
  await new ZAddCommand([key, { score, member }]).exec(client);
  const res = await new ZIncrByCommand([key, 2, member]).exec(client);

  assertEquals(res, 3);
});
