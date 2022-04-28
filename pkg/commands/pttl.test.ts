import { keygen, newHttpClient } from "../test-utils.ts";
import { PTtlCommand } from "./pttl.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { SetExCommand } from "./setex.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("returns the ttl on a key", async () => {
  const key = newKey();
  const ttl = 60;
  await new SetExCommand(key, ttl, "value").exec(client);
  const res = await new PTtlCommand(key).exec(client);
  assertEquals(res <= ttl * 1000, true);
});
