import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { PersistCommand } from "./persist";
import { SetCommand } from "./set";

import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("persists the key", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value, { ex: 2 }]).exec(client);
  const res = await new PersistCommand([key]).exec(client);
  expect(res).toEqual(1);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(value);
});
