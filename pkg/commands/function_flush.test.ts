import { describe, expect, test } from "bun:test";

import { FunctionFlushCommand } from "./function_flush";

describe("FUNCTION FLUSH", () => {
  test("builds correct command (no mode)", () => {
    const c = new FunctionFlushCommand();
    expect(c.command).toEqual(["function", "flush"]);
  });
});
