import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { ZAddCommand } from "./zadd.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZRemRangeByScoreCommand } from "./zremrangebyscore.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test(
  "returns the number of removed elements",
  async () => {
    const key = newKey();
    const member1 = randomID();
    const member2 = randomID();
    const member3 = randomID();
    await new ZAddCommand(
      key,
      { score: 1, member: member1 },
      { score: 2, member: member2 },
      { score: 3, member: member3 },
    ).exec(client);
    const res = await new ZRemRangeByScoreCommand(key, 1, 2).exec(client);
    assertEquals(res, 2);
  },
);
