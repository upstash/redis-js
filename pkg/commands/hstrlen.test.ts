import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { HSetCommand } from "./hset";
import { HStrLenCommand } from "./hstrlen";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("returns correct length", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();

  const res = await new HStrLenCommand([key, field]).exec(client);
  expect(res).toEqual(0);
  await new HSetCommand([key, { [field]: value }]).exec(client);

  const res2 = await new HStrLenCommand([key, field]).exec(client);

  expect(res2).toEqual(value.length);
});
