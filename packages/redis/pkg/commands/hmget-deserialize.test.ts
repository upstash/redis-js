import { describe, expect, test } from "bun:test";

import { HGetDelCommand } from "./hgetdel";
import { HGetExCommand } from "./hgetex";
import { HMGetCommand } from "./hmget";

// 2^53 + 1. JSON.parse rounds it to 9007199254740992.
const UNSAFE = "9007199254740993";

describe("unsafe integer fields", () => {
  test("hmget keeps the exact digits", () => {
    const cmd = new HMGetCommand(["hash", "id", "neg"]);
    expect(cmd.deserialize([UNSAFE, `-${UNSAFE}`])).toEqual({
      id: UNSAFE,
      neg: `-${UNSAFE}`,
    });
  });

  test("hgetex keeps the exact digits", () => {
    const cmd = new HGetExCommand(["hash", { persist: true }, "id"]);
    expect(cmd.deserialize([UNSAFE])).toEqual({ id: UNSAFE });
  });

  test("hgetdel keeps the exact digits", () => {
    const cmd = new HGetDelCommand(["hash", "id"]);
    expect(cmd.deserialize([UNSAFE])).toEqual({ id: UNSAFE });
  });

  test("a leading BOM stays on the original string when the integer is unsafe", () => {
    const raw = `\uFEFF${UNSAFE}`;
    const cmd = new HMGetCommand(["hash", "id"]);
    expect(cmd.deserialize([raw])).toEqual({ id: raw });
  });
});

describe("values the common parser already accepts", () => {
  test("null fields stay null and a fully missing hash stays null", () => {
    const cmd = new HMGetCommand(["hash", "a", "b"]);
    expect(cmd.deserialize(["123", null])).toEqual({ a: 123, b: null });
    expect(cmd.deserialize([null, null])).toEqual(null);
  });

  test("ordinary JSON, decimals, safe integers and a BOM-prefixed number still parse", () => {
    const cmd = new HMGetCommand(["hash", "n", "price", "flag", "obj", "text", "safe", "bom"]);
    expect(
      cmd.deserialize([
        "123",
        "1.5",
        "true",
        '{"a":1}',
        "not-json",
        "9007199254740991",
        "\uFEFF123",
      ])
    ).toEqual({
      n: 123,
      price: 1.5,
      flag: true,
      obj: { a: 1 },
      text: "not-json",
      safe: 9_007_199_254_740_991,
      bom: 123,
    });
  });
});
