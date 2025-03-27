import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireCommand } from "./hexpire";
import { HGetCommand } from "./hget";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

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
  const res = await new HExpireCommand([key, hashKey, 1]).exec(client);
  expect(res).toEqual([-2]);
});

test("should return -2 if the provided key does not exist", async () => {
  const key = newKey();
  const hashKey = newKey();
  const res = await new HExpireCommand([key, hashKey, 1]).exec(client);
  expect(res).toEqual([-2]);
});

test("should return 2 when called with 0 seconds", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();
  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  const res = await new HExpireCommand([key, hashKey, 0]).exec(client);
  expect(res).toEqual([2]);
  const res2 = await new HGetCommand([key, hashKey]).exec(client);
  expect(res2).toEqual(null);
});
