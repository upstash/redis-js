import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { ExpireCommand } from "./expire";
import { GetCommand } from "./get";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("expires a key correctly", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new ExpireCommand([key, 1]).exec(client);
  expect(res).toEqual(1);
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(null);
});

describe("NX", () => {
  test("should set expiry only when the key has no expiry", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new ExpireCommand([key, 1, "NX"]).exec(client);
    expect(res).toEqual(1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand([key]).exec(client);

    expect(res2).toEqual(null);
  });

  test("should not set expiry when the key has expiry", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value, { ex: 1000 }]).exec(client);
    const res = await new ExpireCommand([key, 1, "NX"]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("XX", () => {
  test(
    "should set expiry only when the key has an existing expiry",
    async () => {
      const key = newKey();
      const value = randomID();
      await new SetCommand([key, value, { ex: 1 }]).exec(client);
      const res = await new ExpireCommand([key, 5, "XX"]).exec(client);
      expect(res).toEqual(1);
      await new Promise((res) => setTimeout(res, 6000));
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(null);
    },
    { timeout: 10_000 }
  );

  test("should not set expiry when the key does not have an existing expiry", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new ExpireCommand([key, 5, "XX"]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("GT", () => {
  test(
    "should set expiry only when the new expiry is greater than current one",
    async () => {
      const key = newKey();
      const value = randomID();
      await new SetCommand([key, value, { ex: 1 }]).exec(client);
      const res = await new ExpireCommand([key, 5, "GT"]).exec(client);
      expect(res).toEqual(1);
      await new Promise((res) => setTimeout(res, 6000));
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(null);
    },
    { timeout: 10_000 }
  );

  test("should not set expiry when the new expiry is not greater than current one", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value, { ex: 10 }]).exec(client);
    const res = await new ExpireCommand([key, 5, "GT"]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("LT", () => {
  test(
    "should set expiry only when the new expiry is less than current one",
    async () => {
      const key = newKey();
      const value = randomID();
      await new SetCommand([key, value, { ex: 5 }]).exec(client);
      const res = await new ExpireCommand([key, 3, "LT"]).exec(client);
      expect(res).toEqual(1);
      await new Promise((res) => setTimeout(res, 4000));
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(null);
    },
    { timeout: 10_000 }
  );

  test("should not set expiry when the new expiry is not less than current one", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value, { ex: 10 }]).exec(client);
    const res = await new ExpireCommand([key, 20, "LT"]).exec(client);
    expect(res).toEqual(0);
  });
});
