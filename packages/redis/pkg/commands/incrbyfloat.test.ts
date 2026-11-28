import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SetCommand } from "./set";

import { IncrByFloatCommand } from "./incrbyfloat";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("increments a non-existing value", async () => {
  const key = newKey();
  const res = await new IncrByFloatCommand([key, 2.5]).exec(client);

  expect(res).toEqual(2.5);
});

test("increments and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 5]).exec(client);
  const res = await new IncrByFloatCommand([key, 2.5]).exec(client);

  expect(res).toEqual(7.5);
});

test("returns decimal and exponent-form results as numbers", async () => {
  const key = newKey();
  expect(await new IncrByFloatCommand([key, 0.1]).exec(client)).toBe(0.1);

  await new SetCommand([key, 1e20]).exec(client);
  expect(await new IncrByFloatCommand([key, 1]).exec(client)).toBe(1e20);
});
