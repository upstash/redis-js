import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZCardCommand } from "./zcard.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the cardinality", async () => {
  const key = newKey();
  await new ZAddCommand(key, { score: 1, member: "member1" }).exec(client);
  const res = await new ZCardCommand(key).exec(client);
  assertEquals(res, 1);
});
