import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";

import { HMGetCommand } from "./hmget";
import { HMSetCommand } from "./hmset";
import { HSetCommand } from "./hset";
const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets exiting values", async () => {
  const key = newKey();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
  const res = await new HMSetCommand([key, kv]).exec(client);

  expect(res).toEqual("OK");
  const res2 = await new HMGetCommand([key, field1, field2]).exec(client);

  expect(res2).toEqual(kv);
});

describe("when the hash does not exist", () => {
  test("returns null", async () => {
    const key = newKey();
    const res = await new HMGetCommand([key, randomID()]).exec(client);

    expect(res).toEqual(null);
  });
});

test("gets an object", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const cmd = new HMGetCommand([key, field]);
  const res = await cmd.exec(client);
  expect(res).toEqual({ [field]: value });
});
