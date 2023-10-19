import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of added members", async () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const res = await new SAddCommand([key, value1, value2]).exec(client);
  expect(res).toEqual(2);
});
