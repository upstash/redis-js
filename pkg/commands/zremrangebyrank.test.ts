import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZRemRangeByRankCommand } from "./zremrangebyrank";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of removed elements", async () => {
  const key = newKey();
  const score1 = 1;
  const member1 = randomID();
  const score2 = 2;
  const member2 = randomID();
  const score3 = 3;
  const member3 = randomID();
  await new ZAddCommand([
    key,
    { score: score1, member: member1 },
    { score: score2, member: member2 },
    { score: score3, member: member3 },
  ]).exec(client);
  const res = await new ZRemRangeByRankCommand([key, 1, 2]).exec(client);
  expect(res).toEqual(2);
});
