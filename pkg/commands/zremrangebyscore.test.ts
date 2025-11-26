import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterEach, beforeEach, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZRemRangeByScoreCommand } from "./zremrangebyscore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();

const key = newKey();

afterEach(cleanup);
beforeEach(async () => {
  const member1 = randomID();
  const member2 = randomID();
  const member3 = randomID();
  await new ZAddCommand([
    key,
    { score: 1, member: member1 },
    { score: 2, member: member2 },
    { score: 3, member: member3 },
  ]).exec(client);
});

test("returns the number of removed elements", async () => {
  const res = await new ZRemRangeByScoreCommand([key, 1, 2]).exec(client);
  expect(res).toEqual(2);
});

test("returns the number of removed elements with inf", async () => {
  const res = await new ZRemRangeByScoreCommand([key, "-inf", "+inf"]).exec(client);
  expect(res).toEqual(3);
});

test("returns the number of removed elements with exclusive range", async () => {
  const res = await new ZRemRangeByScoreCommand([key, "(1", "(3"]).exec(client);
  expect(res).toEqual(1);
});
