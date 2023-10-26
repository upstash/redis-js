import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { HSetCommand } from "./hset";
import { HValsCommand } from "./hvals";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns correct length", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();

  const res = await new HValsCommand([key]).exec(client);
  expect(res).toEqual([]);
  await new HSetCommand([key, { [field]: value }]).exec(client);

  const res2 = await new HValsCommand([key]).exec(client);

  expect(res2).toEqual([value]);
});
