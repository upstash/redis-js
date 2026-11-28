import { describe, expect, test } from "bun:test";
import { HIncrByFloatCommand } from "./hincrbyfloat";
import { IncrByFloatCommand } from "./incrbyfloat";

const cases: [string, number][] = [
  ["0.10000000000000001", 0.1],
  ["19.989999999999998", 19.99],
  ["1e+20", 1e20],
  ["7.5", 7.5],
];

describe("INCRBYFLOAT deserialization", () => {
  test.each(cases)("parses %s", (reply, expected) => {
    const command = new IncrByFloatCommand(["key", 1]);
    expect(command.deserialize(reply as unknown as number)).toBe(expected);
  });
});

describe("HINCRBYFLOAT deserialization", () => {
  test.each(cases)("parses %s", (reply, expected) => {
    const command = new HIncrByFloatCommand(["key", "field", 1]);
    expect(command.deserialize(reply as unknown as number)).toBe(expected);
  });
});
