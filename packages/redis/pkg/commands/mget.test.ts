import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { MGetCommand } from "./mget";
import { MSetCommand } from "./mset";

import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets exiting values", async () => {
  const key1 = newKey();
  const value1 = randomID();
  const key2 = newKey();
  const value2 = randomID();

  const kv: Record<string, string> = {};
  kv[key1] = value1;
  kv[key2] = value2;
  const res = await new MSetCommand([kv]).exec(client);

  expect(res).toEqual("OK");
  const res2 = await new MGetCommand<[string, string]>([key1, key2]).exec(client);

  expect(res2).toEqual([value1, value2]);
});

test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new MGetCommand<[null]>([key]).exec(client);

  expect(res).toEqual([null]);
});

test("gets an object", async () => {
  const key = newKey();
  const value = { v: randomID() };
  await new SetCommand([key, value]).exec(client);
  const res = await new MGetCommand<[{ v: string }]>([key]).exec(client);

  expect(res).toEqual([value]);
});
