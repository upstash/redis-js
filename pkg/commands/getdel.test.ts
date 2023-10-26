import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SetCommand } from "./set";

import { GetCommand } from "./get";
import { GetDelCommand } from "./getdel";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets an exiting value, then deletes", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new GetDelCommand([key]).exec(client);

  expect(res).toEqual(value);

  const res2 = await new GetCommand([key]).exec(client);
  expect(res2).toEqual(null);
});

test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new GetDelCommand([key]).exec(client);

  expect(res).toEqual(null);
});

test("gets an object", async () => {
  const key = newKey();
  const value = { v: randomID() };
  await new SetCommand([key, value]).exec(client);
  const res = await new GetDelCommand<{ v: string }>([key]).exec(client);

  expect(res).toEqual(value);
});
