import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZRemRangeByScoreCommand } from "./zremrangebyscore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("returns the number of removed elements", async () => {
  const key = newKey();
  const member1 = randomID();
  const member2 = randomID();
  const member3 = randomID();
  await new ZAddCommand([
    key,
    { score: 1, member: member1 },
    { score: 2, member: member2 },
    { score: 3, member: member3 },
  ]).exec(client);
  const res = await new ZRemRangeByScoreCommand([key, 1, 2]).exec(client);
  expect(res).toEqual(2);
});
