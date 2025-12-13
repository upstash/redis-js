import { describe, expect, test } from "bun:test";

import { FunctionLoadCommand } from "./function_load";

describe("FUNCTION LOAD", () => {
  test("builds correct command", () => {
    const code = "#!lua name=mylib\nredis.register_function('f', function() return 'ok' end)\n";

    const c1 = new FunctionLoadCommand([{ code }]);
    expect(c1.command).toEqual(["function", "load", code]);

    const c2 = new FunctionLoadCommand([{ code, replace: true }]);
    expect(c2.command).toEqual(["function", "load", "replace", code]);
  });
});
