import { keygen, newHttpClient } from "../test-utils.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { DecrByCommand } from "./decrby.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("decrements a non-existing value", async () => {
  const key = newKey();
  const res = await new DecrByCommand(key, 2).exec(client);

  assertEquals(res, -2);
});

it("decrements and existing value", async () => {
  const key = newKey();
  await new SetCommand(key, 5).exec(client);
  const res = await new DecrByCommand(key, 2).exec(client);

  assertEquals(res, 3);
});
