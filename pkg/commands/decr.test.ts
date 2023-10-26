import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { DecrCommand } from "./decr";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("decrements a non-existing value", async () => {
  const key = newKey();
  const res = await new DecrCommand([key]).exec(client);

  expect(res).toEqual(-1);
});

test("decrements and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 4]).exec(client);
  const res = await new DecrCommand([key]).exec(client);

  expect(res).toEqual(3);
});
