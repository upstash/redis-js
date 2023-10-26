import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { LRangeCommand } from "./lrange";
import { RPushCommand } from "./rpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the correct range", async () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  await new RPushCommand([key, value1, value2, value3]).exec(client);
  const res = await new LRangeCommand([key, 1, 2]).exec(client);
  expect(res!.length, 2);
  expect(res![0], value2);
  expect(res![1], value3);
});
