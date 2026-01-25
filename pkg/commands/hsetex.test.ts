import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HSetExCommand } from "./hsetex";
import { HGetCommand } from "./hget";
import { HMGetCommand } from "./hmget";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("sets a single field without expiration", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const res = await new HSetExCommand([key, undefined, { [field]: value }]).exec(client);

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);
});

test("sets multiple fields without expiration", async () => {
  const key = newKey();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
  const res = await new HSetExCommand([key, undefined, kv]).exec(client);

  expect(res).toEqual(1); // HSETEX returns 1 for success

  const verifyRes = await new HMGetCommand([key, field1, field2]).exec(client);
  expect(verifyRes).toEqual(kv);
});

test("sets field with expiration in seconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const res = await new HSetExCommand([key, { expiration: { ex: 1 } }, { [field]: value }]).exec(
    client
  );

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const expiredRes = await new HGetCommand([key, field]).exec(client);
  expect(expiredRes).toEqual(null);
});

test("sets field with expiration in milliseconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const res = await new HSetExCommand([key, { expiration: { px: 1000 } }, { [field]: value }]).exec(
    client
  );

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const expiredRes = await new HGetCommand([key, field]).exec(client);
  expect(expiredRes).toEqual(null);
});

test("sets field with expiration using absolute timestamp in seconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const futureTimestamp = Math.floor(Date.now() / 1000) + 2;
  const res = await new HSetExCommand([
    key,
    { expiration: { exat: futureTimestamp } },
    { [field]: value },
  ]).exec(client);

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 3000));
  const expiredRes = await new HGetCommand([key, field]).exec(client);
  expect(expiredRes).toEqual(null);
});

test("sets field with expiration using absolute timestamp in milliseconds", async () => {
  const key = newKey();
  const field = randomID();
  const value = randomID();
  const futureTimestamp = Date.now() + 1000;
  const res = await new HSetExCommand([
    key,
    { expiration: { pxat: futureTimestamp } },
    { [field]: value },
  ]).exec(client);

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);

  // Wait for expiration
  await new Promise((res) => setTimeout(res, 2000));
  const expiredRes = await new HGetCommand([key, field]).exec(client);
  expect(expiredRes).toEqual(null);
});

describe("FNX option", () => {
  test("only sets fields if none exist", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    const field2 = randomID();
    const value2 = randomID();

    // First set should succeed
    const res1 = await new HSetExCommand([
      key,
      { conditional: "FNX" },
      { [field1]: value1, [field2]: value2 },
    ]).exec(client);
    expect(res1).toEqual(1);

    // Second set should fail because fields exist
    const res2 = await new HSetExCommand([
      key,
      { conditional: "FNX" },
      { [field1]: "new_value" },
    ]).exec(client);
    expect(res2).toEqual(0);

    // Verify original value is unchanged
    const verifyRes = await new HGetCommand([key, field1]).exec(client);
    expect(verifyRes).toEqual(value1);
  });
});

describe("FXX option", () => {
  test("only sets fields if all already exist", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    const value2 = randomID();

    // First set with FXX should fail (no fields exist)
    const res1 = await new HSetExCommand([key, { conditional: "FXX" }, { [field1]: value1 }]).exec(
      client
    );
    expect(res1).toEqual(0);

    // Set the field first
    await new HSetExCommand([key, undefined, { [field1]: value1 }]).exec(client);

    // Now FXX should succeed (field exists, so it can be updated with FXX)
    const res2 = await new HSetExCommand([key, { conditional: "FXX" }, { [field1]: value2 }]).exec(
      client
    );
    expect(res2).toEqual(1); // Returns 1 for success

    // Verify value was updated
    const verifyRes = await new HGetCommand([key, field1]).exec(client);
    expect(verifyRes).toEqual(value2);
  });
});

test("sets an object value", async () => {
  const key = newKey();
  const field = randomID();
  const value = { v: randomID() };
  const res = await new HSetExCommand([key, undefined, { [field]: value }]).exec(client);

  expect(res).toEqual(1);

  const verifyRes = await new HGetCommand([key, field]).exec(client);
  expect(verifyRes).toEqual(value);
});

test("command structure is correct with EX option", () => {
  const key = randomID();
  const field = randomID();
  const value = randomID();
  const cmd = new HSetExCommand([key, { expiration: { ex: 10 } }, { [field]: value }]);
  expect(cmd.command).toEqual(["hsetex", key, "EX", 10, "FIELDS", 1, field, value]);
});

test("command structure is correct with PX option", () => {
  const key = randomID();
  const field = randomID();
  const value = randomID();
  const cmd = new HSetExCommand([key, { expiration: { px: 10_000 } }, { [field]: value }]);
  expect(cmd.command).toEqual(["hsetex", key, "PX", 10_000, "FIELDS", 1, field, value]);
});

test("command structure is correct with FNX option", () => {
  const key = randomID();
  const field = randomID();
  const value = randomID();
  const cmd = new HSetExCommand([key, { conditional: "FNX" }, { [field]: value }]);
  expect(cmd.command).toEqual(["hsetex", key, "FNX", "FIELDS", 1, field, value]);
});

test("command structure is correct with FXX option", () => {
  const key = randomID();
  const field = randomID();
  const value = randomID();
  const cmd = new HSetExCommand([key, { conditional: "FXX" }, { [field]: value }]);
  expect(cmd.command).toEqual(["hsetex", key, "FXX", "FIELDS", 1, field, value]);
});

test("command structure is correct with both conditional and expiration", () => {
  const key = randomID();
  const field = randomID();
  const value = randomID();
  const cmd = new HSetExCommand([
    key,
    { conditional: "FNX", expiration: { ex: 10 } },
    { [field]: value },
  ]);
  expect(cmd.command).toEqual(["hsetex", key, "FNX", "EX", 10, "FIELDS", 1, field, value]);
});

test("command structure is correct without options", () => {
  const key = randomID();
  const field1 = randomID();
  const value1 = randomID();
  const field2 = randomID();
  const value2 = randomID();
  const cmd = new HSetExCommand([key, undefined, { [field1]: value1, [field2]: value2 }]);
  expect(cmd.command).toContain("hsetex");
  expect(cmd.command).toContain(key);
  expect(cmd.command).toContain("FIELDS");
  expect(cmd.command).toContain(2);
});
