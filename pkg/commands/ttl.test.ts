import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetExCommand } from "./setex.ts";
import { TtlCommand } from "./ttl.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the ttl on a key", async () => {
  const key = newKey();
  const ttl = 60;
  await new SetExCommand(key, ttl, "value").exec(client);
  const res = await new TtlCommand(key).exec(client);
  assertEquals(res, ttl);
});
