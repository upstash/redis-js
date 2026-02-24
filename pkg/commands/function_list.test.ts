import { describe, expect, test } from "bun:test";

import { FunctionListCommand } from "./function_list";

describe("FUNCTION LIST", () => {
  test("builds correct command", () => {
    const c1 = new FunctionListCommand([]);
    expect(c1.command).toEqual(["function", "list"]);

    const c2 = new FunctionListCommand([{ libraryName: "mylib", withCode: true }]);
    expect(c2.command).toEqual(["function", "list", "libraryname", "mylib", "withcode"]);
  });

  test("deserializes RESP2-style kv arrays", () => {
    const cmd = new FunctionListCommand([]);
    const raw = [
      [
        "library_name",
        "mylib",
        "engine",
        "LUA",
        "functions",
        [
          ["name", "f1", "description", null, "flags", ["no-writes"]],
          ["name", "f2", "description", "hi", "flags", []],
        ],
        "library_code",
        "#!lua name=mylib\n...",
      ],
    ];

    expect(cmd.deserialize(raw)).toEqual([
      {
        libraryName: "mylib",
        engine: "LUA",
        functions: [
          { name: "f1", flags: ["no-writes"] },
          { name: "f2", description: "hi", flags: [] },
        ],
        libraryCode: "#!lua name=mylib\n...",
      },
    ]);
  });

  test("deserializes object-shaped entries", () => {
    const cmd = new FunctionListCommand([undefined]);
    const raw = [
      {
        library_name: "mylib",
        engine: "LUA",
        functions: [{ name: "f1", description: null, flags: ["x"] }],
      },
    ];

    expect(cmd.deserialize(raw)).toEqual([
      {
        libraryName: "mylib",
        engine: "LUA",
        functions: [{ name: "f1", flags: ["x"] }],
      },
    ]);
  });
});
