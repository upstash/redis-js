import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { IncrByCommand } from "./incrby";

import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("increments a non-existing value", async () => {
  const key = newKey();
  const res = await new IncrByCommand([key, 2]).exec(client);

  expect(res).toEqual(2);
});

test("increments and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 5]).exec(client);
  const res = await new IncrByCommand([key, 2]).exec(client);

  expect(res).toEqual(7);
});
