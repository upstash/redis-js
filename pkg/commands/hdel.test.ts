import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HDelCommand } from "./hdel";
import { HGetCommand } from "./hget";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("deletes a hash that does not exist", async () => {
  const key = newKey();
  const field = randomID();
  const res = await new HDelCommand([key, field]).exec(client);

  expect(res).toEqual(0);
});

test("deletes a field that exists", async () => {
  const key = newKey();
  const field = randomID();
  await new HSetCommand([key, { [field]: randomID() }]).exec(client);
  const res = await new HDelCommand([key, field]).exec(client);

  expect(res).toEqual(1);
  const res2 = await new HGetCommand([key, field]).exec(client);

  expect(res2).toEqual(null);
});

test("deletes multiple fields", async () => {
  const key = newKey();
  const field1 = randomID();
  const field2 = randomID();
  await new HSetCommand([key, { [field1]: randomID(), [field2]: randomID() }]).exec(client);
  const res = await new HDelCommand([key, field1, field2]).exec(client);

  expect(res).toEqual(2);
  const res2 = await new HGetCommand([key, field1]).exec(client);
  expect(res2).toEqual(null);

  const res3 = await new HGetCommand([key, field2]).exec(client);
  expect(res3).toEqual(null);
});
