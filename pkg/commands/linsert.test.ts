import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { LInsertCommand } from "./linsert";

import { LPushCommand } from "./lpush";
import { LRangeCommand } from "./lrange";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("adds the element", async () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  await new LPushCommand([key, value1]).exec(client);
  const res = await new LInsertCommand([key, "before", value1, value2]).exec(client);
  expect(res).toEqual(2);

  const list = await new LRangeCommand([key, 0, -1]).exec(client);
  expect(list, [value2, value1]);
});
