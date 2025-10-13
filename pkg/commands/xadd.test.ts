import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { XAddCommand } from "./xadd";
import { XRangeCommand } from "./xrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("should return valid stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const res = await new XAddCommand([
      key,
      "*",
      {
        [field1]: member1,
        [field2]: member2,
      },
    ]).exec(client);

    expect(res.length).toBeGreaterThan(0);
  });
});

describe("with NOMKSTREAM", () => {
  test("should return valid stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const first = await new XAddCommand([
      key,
      "*",
      {
        [field1]: member1,
        [field2]: member2,
      },
    ]).exec(client);
    expect(first.length).toBeGreaterThan(0);

    const res = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { nomkStream: true },
    ]).exec(client);
    expect(res.length).toBeGreaterThan(0);
  });

  test("should return null", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const res = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { nomkStream: true },
    ]).exec(client);

    expect(res).toBeNull();
  });
});

describe("with threshold", () => {
  test("should always return less than or equal to 5", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    for (let i = 0; i < 10; i++) {
      const xaddRes = await new XAddCommand([
        key,
        "*",
        { [field1]: member1, [field2]: member2 },
        { trim: { comparison: "=", threshold: 5, type: "MAXLEN" } },
      ]).exec(client);
      expect(xaddRes.length).toBeGreaterThan(0);

      const xrangeRes = await new XRangeCommand([key, "-", "+"]).exec(client);
      expect(Object.keys(xrangeRes).length).toBeLessThanOrEqual(5);
    }
  });

  test("should trim the stream by stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const xaddRes = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
    ]).exec(client);

    await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { trim: { type: "minid", threshold: xaddRes, comparison: "=" } },
    ]).exec(client);

    const xrangeRes = await new XRangeCommand([key, "-", "+"]).exec(client);
    expect(Object.keys(xrangeRes).length).toEqual(2);
  });
});
