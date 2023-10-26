import { keygen, newHttpClient } from "../test-utils";
import { SetCommand } from "./set";

import { afterAll, expect, test } from "bun:test";
import { DecrByCommand } from "./decrby";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("decrements a non-existing value", async () => {
  const key = newKey();
  const res = await new DecrByCommand([key, 2]).exec(client);

  expect(res).toEqual(-2);
});

test("decrements and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 5]).exec(client);
  const res = await new DecrByCommand([key, 2]).exec(client);

  expect(res).toEqual(3);
});
