import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZRemRangeByRankCommand } from "./zremrangebyrank.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the number of removed elements",
  async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = crypto.randomUUID();
    const score2 = 2;
    const member2 = crypto.randomUUID();
    const score3 = 3;
    const member3 = crypto.randomUUID();
    await new ZAddCommand(
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
      { score: score3, member: member3 },
    ).exec(client);
    const res = await new ZRemRangeByRankCommand(key, 1, 2).exec(client);
    assertEquals(res, 2);
  },
);
