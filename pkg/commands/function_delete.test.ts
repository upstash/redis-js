import { describe, expect, test } from "bun:test";

import { FunctionDeleteCommand } from "./function_delete";

describe("FUNCTION DELETE", () => {
  test("builds correct command", () => {
    const c = new FunctionDeleteCommand(["mylib"]);
    expect(c.command).toEqual(["function", "delete", "mylib"]);
  });
});
