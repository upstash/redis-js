import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient, randomID } from "../test-utils";
import { ZAddCommand } from "./zadd";

import { ZScoreCommand } from "./zscore";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the score", async () => {
  const key = newKey();
  const member = randomID();
  const score = Math.floor(Math.random() * 10);
  await new ZAddCommand([key, { score, member }]).exec(client);
  const res = await new ZScoreCommand([key, member]).exec(client);
  expect(res).toEqual(score);
});
