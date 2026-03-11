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

test("throws when there are no members", async () => {
  const key = newKey();
  // @ts-expect-error It should give type error when no members are given
  expect(async () => await new SAddCommand([key]).exec(client)).toThrow();
});
