import { describe, expect, test } from "bun:test";

import { KeysCommand } from "./keys";
import { ScanCommand, type ScanResultWithType } from "./scan";

// Key names that are also valid JSON. Redis gives them as strings, and the client must not parse them.
const NAMES = ["user:1", "123", "null", "true", '"draft"', '{"a": 1}', "[1,2]"];

describe("key names that are valid JSON", () => {
  test("keys returns them unchanged", () => {
    const cmd = new KeysCommand(["*"]);
    expect(cmd.deserialize(NAMES)).toEqual(NAMES);
  });

  test("scan returns them unchanged", () => {
    const cmd = new ScanCommand([0]);
    expect(cmd.deserialize(["0", NAMES])).toEqual(["0", NAMES]);
  });

  test("scan with match, count and type returns them unchanged", () => {
    const cmd = new ScanCommand(["42", { match: "*", count: 10, type: "string" }]);
    expect(cmd.deserialize(["7", NAMES])).toEqual(["7", NAMES]);
  });

  test("scan with withType keeps the names and types", () => {
    const cmd = new ScanCommand<ScanResultWithType>([0, { withType: true }]);
    expect(cmd.deserialize(["0", ['"draft"', "string", "123", "hash"]])).toEqual([
      "0",
      [
        { key: '"draft"', type: "string" },
        { key: "123", type: "hash" },
      ],
    ]);
  });
});
