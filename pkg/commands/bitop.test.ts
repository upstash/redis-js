import { BitOpCommand } from "./bitop.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { keygen, newHttpClient } from "../test-utils.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  it("returns 0", async () => {
    const source = newKey();
    const dest = newKey();
    const res = await new BitOpCommand("and", dest, source).exec(client);
    assertEquals(res, 0);
  });
});

describe("when key is set", () => {
  describe("not", () => {
    it("inverts all bits", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand(source, sourcevalue).exec(client);
      await new SetCommand(dest, destValue).exec(client);
      const res = await new BitOpCommand("not", dest, source).exec(client);
      assertEquals(res, 11);
    });
  });
  describe("and", () => {
    it("works", async () => {
      const source = newKey();
      const sourcevalue = "Hello World";
      const dest = newKey();
      const destValue = "foo: bar";
      await new SetCommand(source, sourcevalue).exec(client);
      await new SetCommand(dest, destValue).exec(client);
      const res = await new BitOpCommand("and", dest, source).exec(client);
      assertEquals(res, 11);
    });
  });
});
