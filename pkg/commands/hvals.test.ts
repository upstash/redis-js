import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { HValsCommand } from "./hvals.ts";
import { HSetCommand } from "./hset.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns correct length", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();

  const res = await new HValsCommand([key]).exec(client);
  assertEquals(res, []);
  await new HSetCommand([key, { [field]: value }]).exec(client);

  const res2 = await new HValsCommand([key]).exec(client);

  assertEquals(res2, [value]);
});
