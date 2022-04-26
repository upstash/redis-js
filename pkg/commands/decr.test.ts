import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { DecrCommand } from "./decr.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
it("decrements a non-existing value", async () => {
  const key = newKey();
  const res = await new DecrCommand(key).exec(client);

  assertEquals(res, -1);
});

it("decrements and existing value", async () => {
  const key = newKey();
  await new SetCommand(key, 4).exec(client);
  const res = await new DecrCommand(key).exec(client);

  assertEquals(res, 3);
});
