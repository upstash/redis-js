import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HGetCommand } from "./hget";
import { HSetCommand } from "./hset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets an exiting value", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetCommand([key, field]).exec(client);

  expect(res).toEqual(value);
});

test("gets a non-existing hash", async () => {
  const key = newKey();
  const field = randomID();
  const res = await new HGetCommand([key, field]).exec(client);

  expect(res).toEqual(null);
});

test("gets a non-existing field", async () => {
  const key = newKey();
  const field = randomID();
  await new HSetCommand([
    key,
    {
      [randomID()]: randomID(),
    },
  ]).exec(client);
  const res = await new HGetCommand([key, field]).exec(client);

  expect(res).toEqual(null);
});

test("gets an object", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetCommand([key, field]).exec(client);

  expect(res).toEqual(value);
});
