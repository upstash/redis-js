import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { GetCommand } from "./get";
import { MGetCommand } from "./mget";
import { MSetNXCommand } from "./msetnx";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("sets values", async () => {
  const key1 = newKey();
  const value1 = randomID();
  const key2 = newKey();
  const value2 = randomID();

  const kv: Record<string, string> = {};
  kv[key1] = value1;
  kv[key2] = value2;
  const res = await new MSetNXCommand([kv]).exec(client);

  expect(res).toEqual(1);
  const res2 = await new MGetCommand<[string, string]>([key1, key2]).exec(client);

  expect(res2).toEqual([value1, value2]);
});

test("does not set values if one key already exists", async () => {
  const key1 = newKey();
  const value1 = randomID();
  const key2 = newKey();
  const value2 = randomID();
  await new SetCommand([key1, value1]).exec(client);
  const kv: Record<string, string> = {};
  kv[key1] = value1;
  kv[key2] = value2;
  const res = await new MSetNXCommand([kv]).exec(client);

  expect(res).toEqual(0);

  const res2 = await new GetCommand([key2]).exec(client);

  expect(res2).toEqual(null);
});
