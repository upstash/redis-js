import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SRemCommand } from "./srem";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of removed members", async () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();
  await new SAddCommand([key, value1, value2]).exec(client);
  const res = await new SRemCommand([key, value1]).exec(client);
  expect(res).toEqual(1);
});
