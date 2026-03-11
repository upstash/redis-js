import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { GetExCommand } from "./getex";
import { GetCommand } from "./get";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("gets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([key]).exec(client);
    expect(res2).toEqual(value);
  });
});

describe("ex", () => {
  test("gets value and sets expiry in seconds", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([key, { ex: 1 }]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);
    expect(res3).toEqual(null);
  });
});

describe("px", () => {
  test("gets value and sets expiry in milliseconds", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([key, { px: 1000 }]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

describe("exat", () => {
  test("gets value and sets expiry in Unix time (seconds)", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([
      key,
      {
        exat: Math.floor(Date.now() / 1000) + 2,
      },
    ]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 3000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

describe("pxat", () => {
  test("gets value and sets expiry in Unix time (milliseconds)", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([key, { pxat: Date.now() + 2000 }]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 3000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

describe("persist", () => {
  test("gets value and removes expiry", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value, { ex: 1 }]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetExCommand([key, { persist: true }]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(value);
  });
});
