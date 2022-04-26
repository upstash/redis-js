import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { RandomKeyCommand } from "./randomkey.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("returns a random key", async () => {
  const key = newKey();
  await new SetCommand(key, Math.random().toString()).exec(client);
  const res = await new RandomKeyCommand().exec(client);
  assertEquals(typeof res, "string");
});
