import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { GetCommand } from "./get";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("without options", () => {
  test("sets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(value);
  });
});
test("ex", () => {
  test("sets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value, { ex: 1 }]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);
    expect(res3).toEqual(null);
  });
});
test("px", () => {
  test("sets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value, { px: 1000 }]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

test("exat", () => {
  test("sets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([
      key,
      value,
      {
        exat: Math.floor(Date.now() / 1000) + 2,
      },
    ]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 3000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

test("pxat", () => {
  test("sets value", async () => {
    const key = newKey();
    const value = randomID();

    const res = await new SetCommand([key, value, { pxat: Date.now() + 1000 }]).exec(client);
    expect(res).toEqual("OK");
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(value);
    await new Promise((res) => setTimeout(res, 2000));

    const res3 = await new GetCommand([key]).exec(client);

    expect(res3).toEqual(null);
  });
});

test("get", () => {
  test("gets the old value", async () => {
    const key = newKey();
    const old = randomID();
    const value = randomID();
    await new SetCommand([key, old]).exec(client);

    const res = await new SetCommand([key, value, { get: true }]).exec(client);
    expect(res).toEqual(old);
  });
});

test("get with xx", () => {
  test("gets the old value", async () => {
    const key = newKey();
    const old = randomID();
    const value = randomID();
    await new SetCommand([key, old]).exec(client);

    const res = await new SetCommand([key, value, { get: true, xx: true }]).exec(client);
    expect(res).toEqual(old);
  });
});
test("nx", () => {
  test("when key exists", () => {
    test("does nothing", async () => {
      const key = newKey();
      const value = randomID();
      const newValue = randomID();

      await new SetCommand([key, value]).exec(client);
      const res = await new SetCommand([key, newValue, { nx: true }]).exec(client);
      expect(res).toEqual(null);
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(value);
    });
  });
  test("when key does not exists", () => {
    test("overwrites key", async () => {
      const key = newKey();
      const value = randomID();

      const res = await new SetCommand([key, value, { nx: true }]).exec(client);
      expect(res).toEqual("OK");
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(value);
    });
  });
});
test("xx", () => {
  test("when key exists", () => {
    test("overwrites key", async () => {
      const key = newKey();
      const value = randomID();
      const newValue = randomID();

      await new SetCommand([key, value]).exec(client);
      const res = await new SetCommand([key, newValue, { xx: true }]).exec(client);
      expect(res).toEqual("OK");
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(newValue);
    });
  });
  test("when key does not exists", () => {
    test("does nothing", async () => {
      const key = newKey();
      const value = randomID();

      const res = await new SetCommand([key, value, { xx: true }]).exec(client);
      expect(res).toEqual(null);
      const res2 = await new GetCommand([key]).exec(client);
      expect(res2).toEqual(null);
    });
  });
});
