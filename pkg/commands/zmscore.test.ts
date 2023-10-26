import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient, randomID } from "../test-utils";
import { ZAddCommand } from "./zadd";

import { ZMScoreCommand } from "./zmscore";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the score for single member", async () => {
  const key = newKey();
  const member = randomID();
  const score = Math.floor(Math.random() * 10);
  await new ZAddCommand([key, { score, member }]).exec(client);
  const res = await new ZMScoreCommand([key, [member]]).exec(client);
  expect(res).toEqual([score]);
});

test("returns the score for multiple members", async () => {
  const key = newKey();
  const member1 = randomID();
  const member2 = randomID();
  const member3 = randomID();
  const score1 = Math.floor(Math.random() * 10);
  const score2 = Math.floor(Math.random() * 10);
  const score3 = Math.floor(Math.random() * 10);
  await new ZAddCommand([
    key,
    { score: score1, member: member1 },
    {
      score: score2,
      member: member2,
    },
    { score: score3, member: member3 },
  ]).exec(client);
  const res = await new ZMScoreCommand([key, [member1, member2, member3]]).exec(client);
  expect(res).toEqual([score1, score2, score3]);
});
