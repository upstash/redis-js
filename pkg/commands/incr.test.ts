import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SetCommand } from "./set";

import { IncrCommand } from "./incr";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("increments a non-existing value", async () => {
  const key = newKey();
  const res = await new IncrCommand([key]).exec(client);

  expect(res).toEqual(1);
});

test("increments and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 4]).exec(client);
  const res = await new IncrCommand([key]).exec(client);

  expect(res).toEqual(5);
});
