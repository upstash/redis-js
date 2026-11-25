import { describe, expect, test } from "bun:test";
import { HGetAllCommand } from "./hgetall";

describe("HGETALL deserialization", () => {
  test("parses decimals while preserving unsafe integers", () => {
    const command = new HGetAllCommand(["key"]);
    expect(
      command.deserialize(["price", "1.5", "discount", "-0.25", "large", "9007199254740993"])
    ).toEqual({ price: 1.5, discount: -0.25, large: "9007199254740993" });
  });

  test("keeps existing JSON and missing-hash behavior", () => {
    const command = new HGetAllCommand(["key"]);
    expect(command.deserialize(["integer", "42", "flag", "true", "text", "hello"])).toEqual({
      integer: 42,
      flag: true,
      text: "hello",
    });
    expect(command.deserialize([])).toBeNull();
  });

  test("returns raw fields when automatic deserialization is disabled", () => {
    const command = new HGetAllCommand(["key"], { automaticDeserialization: false });
    const response = ["price", "1.5", "large", "9007199254740993"];
    expect(command.deserialize(response)).toEqual(response);
  });
});
