import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { BitPosCommand } from "./bitpos";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  test("returns 0", async () => {
    const key = newKey();
    const res = await new BitPosCommand([key, 0]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("when key is set", () => {
  test("returns position of first set bit", async () => {
    const key = newKey();
    const value = "\xff\xf0\x00";
    await new SetCommand([key, value]).exec(client);
    const res = await new BitPosCommand([key, 0]).exec(client);
    expect(res).toEqual(2);
  });
});

describe("with start", () => {
  test("returns position of first set bit", async () => {
    const key = newKey();
    const value = "\x00\xff\xf0";
    await new SetCommand([key, value]).exec(client);
    const res = await new BitPosCommand([key, 0, 0]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("with start and end", () => {
  test("returns position of first set bit", async () => {
    const key = newKey();
    const value = "\x00\xff\xf0";
    await new SetCommand([key, value]).exec(client);
    const res = await new BitPosCommand([key, 1, 2, -1]).exec(client);
    expect(res).toEqual(16);
  });
});
