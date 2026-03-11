import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { GetCommand } from "./get";
import { GetSetCommand } from "./getset";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("overwrites the original value", async () => {
  const key = newKey();
  const value = randomID();
  const newValue = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new GetSetCommand([key, newValue]).exec(client);

  expect(res).toEqual(value);
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(newValue);
});
test("sets a new value if empty", async () => {
  const key = newKey();
  const newValue = randomID();
  const res = await new GetSetCommand([key, newValue]).exec(client);

  expect(res).toEqual(null);
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(newValue);
});
