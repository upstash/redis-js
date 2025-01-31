import { Redis } from "../redis";
import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("gets value", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value);
    expect(res).toEqual("OK");
    const res2 = await redis.getex(key);
    expect(res2).toEqual(value);
  });
});

describe("ex", () => {
  test("gets value and sets expiry in seconds", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value);
    expect(res).toEqual("OK");
    const [res1, res2] = await Promise.all([
      redis.exists(key),
      redis.getex(key, { ex: 1 })
    ]);
    expect(res1).toEqual(1);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await redis.get(key);
    expect(res3).toEqual(null);
  });
});

describe("px", () => {
  test("gets value and sets expiry in milliseconds", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value);
    expect(res).toEqual("OK");
    const res2 = await redis.getex(key, { px: 1000 });
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await redis.get(key);

    expect(res3).toEqual(null);
  });
});

describe("exat", () => {
  test("gets value and sets expiry in Unix time (seconds)", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value);
    expect(res).toEqual("OK");
    const res2 = await redis.getex(
      key,
      {
        exat: Math.floor(Date.now() / 1000) + 2,
      },
    );
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 3000));

    const res3 = await redis.get(key);

    expect(res3).toEqual(null);
  });
});

describe("pxat", () => {
  test("gets value and sets expiry in Unix time (milliseconds)", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value);
    expect(res).toEqual("OK");
    const res2 = await redis.getex(key, { pxat: Date.now() + 2000 });
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 3000));

    const res3 = await redis.get(key);

    expect(res3).toEqual(null);
  });
});

describe("persist", () => {
  test("gets value and removes expiry", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = randomID();

    const res = await redis.set(key, value, { ex: 1 });
    expect(res).toEqual("OK");
    const res2 = await redis.getex(key, { persist: true });
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await redis.get(key);

    expect(res3).toEqual(value);
  });
});
