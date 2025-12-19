import { describe, expect, test } from "bun:test";

import { FunctionFlushCommand } from "./function_flush";

describe("FUNCTION FLUSH", () => {
  test("builds correct command (no mode)", () => {
    const c = new FunctionFlushCommand([]);
    expect(c.command).toEqual(["function", "flush"]);
  });

  test("builds correct command (SYNC)", () => {
    const c = new FunctionFlushCommand([{ mode: "SYNC" }]);
    expect(c.command).toEqual(["function", "flush", "SYNC"]);
  });

  test("builds correct command (ASYNC)", () => {
    const c = new FunctionFlushCommand([{ mode: "ASYNC" }]);
    expect(c.command).toEqual(["function", "flush", "ASYNC"]);
  });
});
