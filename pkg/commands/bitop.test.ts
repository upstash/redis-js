import { BitOpCommand } from "./bitop";

import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  test("returns 0", async () => {
    const source = newKey();
    const dest = newKey();
    const res = await new BitOpCommand(["and", dest, source]).exec(client);
    expect(res).toEqual(0);
  });
});

describe("when key is set", () => {
  describe("not", () => {
    test("inverts all bits", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand([source, sourcevalue]).exec(client);
      await new SetCommand([dest, destValue]).exec(client);
      const res = await new BitOpCommand(["not", dest, source]).exec(client);
      expect(res).toEqual(11);
    });
  });
  describe("and", () => {
    test("works", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand([source, sourcevalue]).exec(client);
      await new SetCommand([dest, destValue]).exec(client);
      const res = await new BitOpCommand(["and", dest, source]).exec(client);
      expect(res).toEqual(11);
    });
  });
});
