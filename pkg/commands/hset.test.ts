import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HGetCommand } from "./hget";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("sets value", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();

  const res = await new HSetCommand([key, { [field]: value }]).exec(client);

  expect(res).toEqual(1);
  const res2 = await new HGetCommand([key, field]).exec(client);

  expect(res2).toEqual(value);
});
