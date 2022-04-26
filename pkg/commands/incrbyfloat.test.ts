import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";

import { IncrByFloatCommand } from "./incrbyfloat.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("increments a non-existing value", async () => {
  const key = newKey();
  const res = await new IncrByFloatCommand(key, 2.5).exec(client);

  assertEquals(res, 2.5);
});

it("increments and existing value", async () => {
  const key = newKey();
  await new SetCommand(key, 5).exec(client);
  const res = await new IncrByFloatCommand(key, 2.5).exec(client);

  assertEquals(res, 7.5);
});
