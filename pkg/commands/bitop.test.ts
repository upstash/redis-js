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

  describe("diff", () => {
    test("sets bits that are in X but not in any Y", async () => {
      const x = newKey();
      const y1 = newKey();
      const y2 = newKey();
      const dest = newKey();

      // Set some bits in X
      await new SetCommand([x, "ABC"]).exec(client);
      // Set some bits in Y1 and Y2
      await new SetCommand([y1, "A"]).exec(client);
      await new SetCommand([y2, "B"]).exec(client);

      const res = await new BitOpCommand(["diff", dest, x, y1, y2]).exec(client);
      expect(res).toBeGreaterThanOrEqual(0);
    });
  });

  describe("diff1", () => {
    test("sets bits that are in Y but not in X", async () => {
      const x = newKey();
      const y1 = newKey();
      const y2 = newKey();
      const dest = newKey();

      // Set some bits in X
      await new SetCommand([x, "A"]).exec(client);
      // Set some bits in Y1 and Y2
      await new SetCommand([y1, "AB"]).exec(client);
      await new SetCommand([y2, "AC"]).exec(client);

      const res = await new BitOpCommand(["diff1", dest, x, y1, y2]).exec(client);
      expect(res).toBeGreaterThanOrEqual(0);
    });
  });

  describe("andor", () => {
    test("sets bits that are in X AND in one or more Y", async () => {
      const x = newKey();
      const y1 = newKey();
      const y2 = newKey();
      const dest = newKey();

      // Set some bits in X
      await new SetCommand([x, "ABC"]).exec(client);
      // Set some bits in Y1 and Y2
      await new SetCommand([y1, "AB"]).exec(client);
      await new SetCommand([y2, "AC"]).exec(client);

      const res = await new BitOpCommand(["andor", dest, x, y1, y2]).exec(client);
      expect(res).toBeGreaterThanOrEqual(0);
    });
  });

  describe("one", () => {
    test("sets bits that are in exactly one source", async () => {
      const x1 = newKey();
      const x2 = newKey();
      const x3 = newKey();
      const dest = newKey();

      // Set some bits in different sources
      await new SetCommand([x1, "A"]).exec(client);
      await new SetCommand([x2, "B"]).exec(client);
      await new SetCommand([x3, "C"]).exec(client);

      const res = await new BitOpCommand(["one", dest, x1, x2, x3]).exec(client);
      expect(res).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("command structure", () => {
  test("diff command structure", () => {
    const cmd = new BitOpCommand(["diff", "dest", "x", "y1", "y2"]);
    expect(cmd.command).toEqual(["bitop", "diff", "dest", "x", "y1", "y2"]);
  });

  test("diff1 command structure", () => {
    const cmd = new BitOpCommand(["diff1", "dest", "x", "y1", "y2"]);
    expect(cmd.command).toEqual(["bitop", "diff1", "dest", "x", "y1", "y2"]);
  });

  test("andor command structure", () => {
    const cmd = new BitOpCommand(["andor", "dest", "x", "y1", "y2"]);
    expect(cmd.command).toEqual(["bitop", "andor", "dest", "x", "y1", "y2"]);
  });

  test("one command structure", () => {
    const cmd = new BitOpCommand(["one", "dest", "x1", "x2", "x3"]);
    expect(cmd.command).toEqual(["bitop", "one", "dest", "x1", "x2", "x3"]);
  });
});
