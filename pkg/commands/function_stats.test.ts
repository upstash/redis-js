import { describe, expect, test } from "bun:test";

import { FunctionStatsCommand } from "./function_stats";

describe("FUNCTION STATS", () => {
  test("builds correct command", () => {
    const c = new FunctionStatsCommand();
    expect(c.command).toEqual(["function", "stats"]);
  });

  test("deserializes engines only (camelCase keys)", () => {
    const cmd = new FunctionStatsCommand();
    const raw = [
      "running_script",
      null,
      "engines",
      [
        "LUA",
        ["libraries_count", 1, "functions_count", 2],
        "JS",
        ["libraries_count", 0, "functions_count", 0],
      ],
    ];

    const stats = cmd.deserialize(raw);
    expect(stats).toEqual({
      engines: {
        LUA: { librariesCount: 1, functionsCount: 2 },
        JS: { librariesCount: 0, functionsCount: 0 },
      },
    });
  });
});
