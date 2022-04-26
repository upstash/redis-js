import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HIncrByFloatCommand } from "./hincrbyfloat.ts";
import { HSetCommand } from "./hset.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
it("increments a non-existing value", async () => {
  const key = newKey();
  const field = crypto.randomUUID();
  const res = await new HIncrByFloatCommand(key, field, 2.5).exec(client);

  assertEquals(res, 2.5);
});

it("increments and existing value", async () => {
  const key = newKey();
  const field = crypto.randomUUID();
  await new HSetCommand(key, { [field]: 5 }).exec(client);
  const res = await new HIncrByFloatCommand(key, field, 2.5).exec(client);

  assertEquals(res, 7.5);
});
