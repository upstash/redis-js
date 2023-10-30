import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { ZRangeCommand } from "./zrange";

import { ZAddCommand } from "./zadd";
import { ZDiffStoreCommand } from "./zdiffstore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("stors the diff", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const out = newKey();

  await new ZAddCommand([
    key1,
    { score: 1, member: "one" },
    {
      score: 2,
      member: "two",
    },
    { score: 3, member: "three" },
  ]).exec(client);
  await new ZAddCommand([
    key2,
    { score: 1, member: "one" },
    {
      score: 2,
      member: "two",
    },
  ]).exec(client);
  const res = await new ZDiffStoreCommand([out, 2, key1, key2]).exec(client);

  expect(res).toEqual(1);

  const zset3 = await new ZRangeCommand([out, 0, -1, { withScores: true }]).exec(client);
  expect(zset3[0]).toBe("three");
  expect(zset3[1]).toBe(3);
});
