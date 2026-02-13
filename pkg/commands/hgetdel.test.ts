import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HGetDelCommand } from "./hgetdel";
import { HSetCommand } from "./hset";
import { HGetCommand } from "./hget";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets and deletes a single field", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetDelCommand([key, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Verify the field was deleted
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

test("gets and deletes multiple fields", async () => {
  const key = newKey();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
  await new HSetCommand([key, kv]).exec(client);
  const res = await new HGetDelCommand([key, field1, field2]).exec(client);

  expect(res).toEqual(kv);

  // Verify the fields were deleted
  const verifyRes1 = await new HGetCommand([key, field1]).exec(client);
  expect(verifyRes1).toEqual(null);
  const verifyRes2 = await new HGetCommand([key, field2]).exec(client);
  expect(verifyRes2).toEqual(null);
});

describe("when a field does not exist", () => {
  test("returns null for that field", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    const field2 = randomID();
    await new HSetCommand([key, { [field1]: value1 }]).exec(client);
    const res = await new HGetDelCommand([key, field1, field2]).exec(client);

    expect(res).toEqual({ [field1]: value1, [field2]: null });
  });
});

describe("when the hash does not exist", () => {
  test("returns null", async () => {
    const key = newKey();
    const res = await new HGetDelCommand([key, randomID()]).exec(client);

    expect(res).toEqual(null);
  });
});

test("gets and deletes an object value", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetDelCommand([key, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Verify the field was deleted
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

test("works with numeric field names", async () => {
  const key = newKey();
  const field1 = 123;
  const value1 = randomID();
  const field2 = 456;
  const value2 = randomID();
  await new HSetCommand([key, { [field1]: value1, [field2]: value2 }]).exec(client);
  const res = await new HGetDelCommand([key, field1, field2]).exec(client);

  expect(res).toEqual({ "123": value1, "456": value2 });

  // Verify the fields were deleted
  const verifyRes = await new HGetCommand([key, String(field1)]).exec(client);
  expect(verifyRes).toEqual(null);
});
