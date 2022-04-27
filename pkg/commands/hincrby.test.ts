import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { HSetCommand } from "./hset.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { HIncrByCommand } from "./hincrby.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("increments a non-existing value", async () => {
  const key = newKey();
  const field = crypto.randomUUID();
  const res = await new HIncrByCommand(key, field, 2).exec(client);

  assertEquals(res, 2);
});

it("increments and existing value", async () => {
  const key = newKey();
  const field = crypto.randomUUID();
  await new HSetCommand(key, { [field]: 5 }).exec(client);
  const res = await new HIncrByCommand(key, field, 2).exec(client);

  assertEquals(res, 7);
});
