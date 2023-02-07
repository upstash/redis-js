import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZCountCommand } from "./zcount.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the cardinality", async () => {
  const key = newKey();
  await new ZAddCommand([key, { score: 1, member: "member1" }]).exec(client);
  const res = await new ZCountCommand([key, 0, 2]).exec(client);
  assertEquals(res, 1);
});
