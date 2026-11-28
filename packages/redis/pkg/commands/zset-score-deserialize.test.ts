import { describe, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZIncrByCommand } from "./zincrby";
import { ZMScoreCommand } from "./zmscore";
import { ZPopMaxCommand } from "./zpopmax";
import { ZPopMinCommand } from "./zpopmin";
import { ZRangeCommand } from "./zrange";
import { ZScanCommand } from "./zscan";
import { ZScoreCommand } from "./zscore";
import { ZUnionCommand } from "./zunion";

describe("ZSCORE deserialization", () => {
  const command = new ZScoreCommand(["key", "member"]);

  test("parses decimal scores written with 17 significant digits", () => {
    expect(command.deserialize("0.10000000000000001")).toBe(0.1);
    expect(command.deserialize("19.989999999999998")).toBe(19.99);
  });

  test("parses scores written in exponent form", () => {
    expect(command.deserialize("1e+20")).toBe(1e20);
    expect(command.deserialize("9.9999999999999995e-08")).toBe(1e-7);
    expect(command.deserialize("-1.5e+19")).toBe(-1.5e19);
  });

  test("parses infinite scores", () => {
    expect(command.deserialize("inf")).toBe(Number.POSITIVE_INFINITY);
    expect(command.deserialize("-inf")).toBe(Number.NEGATIVE_INFINITY);
  });

  test("keeps plain scores and missing members unchanged", () => {
    expect(command.deserialize("1.5")).toBe(1.5);
    expect(command.deserialize(null)).toBeNull();
  });
});

describe("ZMSCORE deserialization", () => {
  test("parses every score and keeps nulls for missing members", () => {
    const command = new ZMScoreCommand(["key", ["a", "b", "c", "d"]]);
    const scores = command.deserialize(["1e+20", null, "-inf", "2"] as string[]);
    expect(scores as (number | null)[]).toEqual([1e20, null, Number.NEGATIVE_INFINITY, 2]);
  });
});

describe("ZRANGE deserialization", () => {
  test("parses scores and keeps members parsed as before with withScores", () => {
    const command = new ZRangeCommand(["key", 0, -1, { withScores: true }]);
    const res = command.deserialize(["m1", "1e+20", '{"a":1}', "-inf", "123", "2.5"]);
    expect(res).toEqual(["m1", 1e20, { a: 1 }, Number.NEGATIVE_INFINITY, 123, 2.5]);
  });

  test("leaves replies without scores unchanged", () => {
    const command = new ZRangeCommand(["key", 0, -1]);
    expect(command.deserialize(["m1", '{"a":1}', "123"])).toEqual(["m1", { a: 1 }, 123]);
  });
});

describe("ZUNION deserialization", () => {
  test("parses scores with withScores", () => {
    const command = new ZUnionCommand([1, "key", { withScores: true }]);
    expect(command.deserialize(["m1", "1e+20", "m2", "inf"])).toEqual([
      "m1",
      1e20,
      "m2",
      Number.POSITIVE_INFINITY,
    ]);
  });

  test("leaves replies without scores unchanged", () => {
    const command = new ZUnionCommand([1, "key"]);
    expect(command.deserialize(["m1", "123"])).toEqual(["m1", 123]);
  });
});

describe("ZPOPMIN / ZPOPMAX deserialization", () => {
  test("parses popped scores", () => {
    const reply = ["m1", "-inf", '{"a":1}', "1e+20"];
    const expected = ["m1", Number.NEGATIVE_INFINITY, { a: 1 }, 1e20];
    expect(new ZPopMinCommand(["key", 2]).deserialize(reply)).toEqual(expected);
    expect(new ZPopMaxCommand(["key", 2]).deserialize(reply)).toEqual(expected);
  });
});

describe("ZSCAN deserialization", () => {
  test("parses scores and keeps the cursor as a string", () => {
    const command = new ZScanCommand(["key", 0]);
    expect(command.deserialize(["0", ["m1", "1e+20", "123", "inf"]])).toEqual([
      "0",
      ["m1", 1e20, 123, Number.POSITIVE_INFINITY],
    ]);
  });
});

describe("ZINCRBY deserialization", () => {
  test("parses exponent-form and infinite results", () => {
    const command = new ZIncrByCommand(["key", 1, "member"]);
    expect(command.deserialize("1e+20" as unknown as number)).toBe(1e20);
    expect(command.deserialize("inf" as unknown as number)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("ZADD deserialization", () => {
  test("parses the score returned with incr", () => {
    const command = new ZAddCommand(["key", { incr: true }, { score: 0.1, member: "m" }]);
    expect(command.deserialize("0.20000000000000001" as unknown as number)).toBe(0.2);
    expect(command.deserialize("inf" as unknown as number)).toBe(Number.POSITIVE_INFINITY);
  });

  test("keeps null when incr is aborted by nx", () => {
    const command = new ZAddCommand(["key", { incr: true, nx: true }, { score: 1, member: "m" }]);
    expect(command.deserialize(null)).toBeNull();
  });

  test("leaves the added count unchanged without incr", () => {
    const command = new ZAddCommand(["key", { score: 1, member: "m" }]);
    expect(command.deserialize(1)).toBe(1);
  });
});
