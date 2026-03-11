import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SetCommand } from "./set";

import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets an exiting value", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new GetCommand([key]).exec(client);

  expect(res).toEqual(value);
});

test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new GetCommand([key]).exec(client);

  expect(res).toEqual(null);
});

test("gets an object", async () => {
  const key = newKey();
  const value = { v: randomID() };
  await new SetCommand([key, value]).exec(client);
  const res = await new GetCommand<{ v: string }>([key]).exec(client);

  expect(res).toEqual(value);
});
