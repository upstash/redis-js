import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HGetExCommand } from "./hgetex";
import { HSetCommand } from "./hset";
import { HGetCommand } from "./hget";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets a single field without expiration", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, undefined, field]).exec(client);

  expect(res).toEqual({ [field]: value });
});

test("gets multiple fields without expiration", async () => {
  const key = newKey();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
  await new HSetCommand([key, kv]).exec(client);
  const res = await new HGetExCommand([key, undefined, field1, field2]).exec(client);

  expect(res).toEqual(kv);
});

test("gets field and sets expiration in seconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, { ex: 1 }, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

test("gets field and sets expiration in milliseconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, { px: 1000 }, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

test("gets field and sets expiration with absolute timestamp in seconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const futureTimestamp = Math.floor(Date.now() / 1000) + 1;
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, { exat: futureTimestamp }, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

test("gets field and sets expiration with absolute timestamp in milliseconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const futureTimestamp = Date.now() + 1000;
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, { pxat: futureTimestamp }, field]).exec(client);

  expect(res).toEqual({ [field]: value });

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(null);
});

describe("when a field does not exist", () => {
  test("returns null for that field", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    const field2 = randomID();
    await new HSetCommand([key, { [field1]: value1 }]).exec(client);
    const res = await new HGetExCommand([key, undefined, field1, field2]).exec(client);

    expect(res).toEqual({ [field1]: value1, [field2]: null });
  });
});

describe("when the hash does not exist", () => {
  test("returns null", async () => {
    const key = newKey();
    const res = await new HGetExCommand([key, undefined, randomID()]).exec(client);

    expect(res).toEqual(null);
  });
});

test("gets an object value", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  await new HSetCommand([key, { [field]: value }]).exec(client);
  const res = await new HGetExCommand([key, undefined, field]).exec(client);

  expect(res).toEqual({ [field]: value });
});

test("works with numeric field names", async () => {
  const key = newKey();
  const field1 = 123;
  const value1 = randomID();
  const field2 = 456;
  const value2 = randomID();
  await new HSetCommand([key, { [field1]: value1, [field2]: value2 }]).exec(client);
  const res = await new HGetExCommand([key, undefined, field1, field2]).exec(client);

  expect(res).toEqual({ "123": value1, "456": value2 });
});

test("command structure is correct with EX option", () => {
  const key = randomID();
  const field = randomID();
  const cmd = new HGetExCommand([key, { ex: 10 }, field]);
  expect(cmd.command).toEqual(["hgetex", key, "EX", 10, "FIELDS", 1, field]);
});

test("command structure is correct with PX option", () => {
  const key = randomID();
  const field = randomID();
  const cmd = new HGetExCommand([key, { px: 10_000 }, field]);
  expect(cmd.command).toEqual(["hgetex", key, "PX", 10_000, "FIELDS", 1, field]);
});

test("command structure is correct with PERSIST option", () => {
  const key = randomID();
  const field = randomID();
  const cmd = new HGetExCommand([key, { persist: true }, field]);
  expect(cmd.command).toEqual(["hgetex", key, "PERSIST", "FIELDS", 1, field]);
});

test("command structure is correct without options", () => {
  const key = randomID();
  const field1 = randomID();
  const field2 = randomID();
  const cmd = new HGetExCommand([key, undefined, field1, field2]);
  expect(cmd.command).toEqual(["hgetex", key, "FIELDS", 2, field1, field2]);
});
