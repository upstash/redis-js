import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SetCommand } from "./set";

import { StrLenCommand } from "./strlen";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the correct length", async () => {
  const key = newKey();
  const value = "abcd";
  await new SetCommand([key, value]).exec(client);
  const res = await new StrLenCommand([key]).exec(client);
  expect(res).toEqual(value.length);
});
