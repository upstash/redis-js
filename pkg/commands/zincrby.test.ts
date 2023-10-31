import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient, randomID } from "../test-utils";
import { ZIncrByCommand } from "./zincrby";

import { ZAddCommand } from "./zadd";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("increments and existing value", async () => {
  const key = newKey();
  const score = 1;
  const member = randomID();
  await new ZAddCommand([key, { score, member }]).exec(client);
  const res = await new ZIncrByCommand([key, 2, member]).exec(client);

  expect(res).toEqual(3);
});
