import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { BitCountCommand } from "./bitcount";

import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  test("returns 0", async () => {
    const key = newKey();
    const res = await new BitCountCommand([key]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("when key is set", () => {
  test("returns bitcount", async () => {
    const key = newKey();
    const value = "Hello World";
    await new SetCommand([key, value]).exec(client);
    const res = await new BitCountCommand([key]).exec(client);
    expect(res).toEqual(43);
  });

  describe("with start and end", () => {
    test("returns bitcount", async () => {
      const key = newKey();
      const value = "Hello World";
      await new SetCommand([key, value]).exec(client);
      const res = await new BitCountCommand([key, 4, 8]).exec(client);
      expect(res).toEqual(22);
    });
  });
});
