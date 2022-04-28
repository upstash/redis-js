import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZRankCommand } from "./zrank.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the rank", async () => {
  const key = newKey();

  await new ZAddCommand(
    key,
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
    { score: 3, member: "member3" },
  ).exec(client);

  const res = await new ZRankCommand(key, "member2").exec(client);
  assertEquals(res, 1);
});
