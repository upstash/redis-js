import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { HSetCommand } from "./hset";

import { HIncrByCommand } from "./hincrby";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("increments a non-existing value", async () => {
  const key = newKey();
  const field = randomID();
  const res = await new HIncrByCommand([key, field, 2]).exec(client);

  expect(res).toEqual(2);
});

test("increments and existing value", async () => {
  const key = newKey();
  const field = randomID();
  await new HSetCommand([key, { [field]: 5 }]).exec(client);
  const res = await new HIncrByCommand([key, field, 2]).exec(client);

  expect(res).toEqual(7);
});
