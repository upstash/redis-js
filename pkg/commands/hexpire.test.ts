import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireCommand } from "./hexpire";
import { HGetCommand } from "./hget";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

// expire options to test
export const TEST_EXPIRE_OPTIONS = [
  "NX",
  "nx",
  "XX",
  "xx",
  "GT",
  "gt",
  "LT",
  "lt",
  undefined,
] as const;

test("expires a hash key correctly", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();
  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  const res = await new HExpireCommand([key, hashKey, 1]).exec(client);
  expect(res).toEqual([1]);
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new HGetCommand([key, hashKey]).exec(client);

  expect(res2).toEqual(null);
});

describe("NX", () => {
  test("should set expiry only when the field has no expiry", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    const res = await new HExpireCommand([key, [hashKey], 1, "NX"]).exec(client);
    expect(res).toEqual([1]);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new HGetCommand([key, hashKey]).exec(client);

    expect(res2).toEqual(null);
  });

  test("should not set expiry when the field has expiry", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    await new HExpireCommand([key, hashKey, 1000]).exec(client);
    const res = await new HExpireCommand([key, hashKey, 1, "NX"]).exec(client);
    expect(res).toEqual([0]);
  });
});

describe("XX", () => {
  test(
    "should set expiry only when the field has an existing expiry",
    async () => {
      const key = newKey();
      const hashKey = newKey();
      const value = randomID();
      await new HSetCommand([key, { [hashKey]: value }]).exec(client);
      await new HExpireCommand([key, hashKey, 1]).exec(client);
      const res = await new HExpireCommand([key, hashKey, 5, "XX"]).exec(client);
      expect(res).toEqual([1]);
      await new Promise((res) => setTimeout(res, 6000));
      const res2 = await new HGetCommand([key, hashKey]).exec(client);
      expect(res2).toEqual(null);
    },
    {
      timeout: 7000,
    }
  );

  test("should not set expiry when the field does not have an existing expiry", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    const res = await new HExpireCommand([key, hashKey, 5, "XX"]).exec(client);
    expect(res).toEqual([0]);
  });
});

describe("GT", () => {
  test(
    "should set expiry only when the new expiry is greater than current one",
    async () => {
      const key = newKey();
      const hashKey = newKey();
      const value = randomID();
      await new HSetCommand([key, { [hashKey]: value }]).exec(client);
      await new HExpireCommand([key, hashKey, 1]).exec(client);
      const res = await new HExpireCommand([key, hashKey, 5, "GT"]).exec(client);
      expect(res).toEqual([1]);
      await new Promise((res) => setTimeout(res, 6000));
      const res2 = await new HGetCommand([key, hashKey]).exec(client);
      expect(res2).toEqual(null);
    },
    {
      timeout: 7000,
    }
  );

  test("should not set expiry when the new expiry is not greater than current one", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    await new HExpireCommand([key, hashKey, 10]).exec(client);
    const res = await new HExpireCommand([key, hashKey, 5, "GT"]).exec(client);
    expect(res).toEqual([0]);
  });
});

describe("LT", () => {
  test("should set expiry only when the new expiry is less than current one", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    await new HExpireCommand([key, hashKey, 5]).exec(client);
    const res = await new HExpireCommand([key, hashKey, 3, "LT"]).exec(client);
    expect(res).toEqual([1]);
    await new Promise((res) => setTimeout(res, 4000));
    const res2 = await new HGetCommand([key, hashKey]).exec(client);
    expect(res2).toEqual(null);
  });

  test("should not set expiry when the new expiry is not less than current one", async () => {
    const key = newKey();
    const hashKey = newKey();
    const value = randomID();
    await new HSetCommand([key, { [hashKey]: value }]).exec(client);
    await new HExpireCommand([key, hashKey, 10]).exec(client);
    const res = await new HExpireCommand([key, hashKey, 20, "LT"]).exec(client);
    expect(res).toEqual([0]);
  });
});

test("should return -2 if no such field exists in the provided hash key", async () => {
  const key = newKey();
  const hashKey = newKey();
  const hashKey2 = newKey();
  await new HSetCommand([key, { [hashKey]: 1 }]).exec(client);
  const res = await new HExpireCommand([key, hashKey2, 1]).exec(client);
  expect(res).toEqual([-2]);
});

test("should return results for multiple fields in order", async () => {
  const key = newKey();
  const hashKey1 = newKey();
  const hashKey2 = newKey();
  const hashKey3 = newKey();
  const value1 = randomID();
  const value2 = randomID();

  await new HSetCommand([key, { [hashKey1]: value1, [hashKey2]: value2 }]).exec(client);

  // Set expiry for the first field
  await new HExpireCommand([key, hashKey1, 1]).exec(client);

  // Pass both fields to HExpireCommand
  const res = await new HExpireCommand([key, [hashKey1, hashKey2, hashKey3], 1, "NX"]).exec(client);

  // Expect the results in order: hashKey1 already has expiry, hashKey2 does not
  expect(res).toEqual([0, 1, -2]);

  // Wait for the expiry to take effect
  await new Promise((res) => setTimeout(res, 2000));

  // Verify that hashKey1 is expired
  const res1 = await new HGetCommand([key, hashKey1]).exec(client);
  expect(res1).toEqual(null);

  // Verify that hashKey2 is expired
  const res2 = await new HGetCommand([key, hashKey2]).exec(client);
  expect(res2).toEqual(null);
});

test("can be defined with options or without", async () => {
  const key = newKey();
  const hashKey = newKey();
  const timestamp = Math.floor(Date.now() / 1000) + 2;

  for (const expireOption of TEST_EXPIRE_OPTIONS) {
    expect(new HExpireCommand([key, hashKey, timestamp, expireOption]).command).toEqual([
      "hexpire",
      key,
      timestamp,
      ...(expireOption ? [expireOption] : []),
      "FIELDS",
      1,
      hashKey,
    ]);
  }
});
