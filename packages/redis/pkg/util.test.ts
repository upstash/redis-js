import { describe, expect, test } from "bun:test";
import { XRangeCommand } from "./commands/xrange";
import { XRevRangeCommand } from "./commands/xrevrange";
import type { Requester } from "./http";
import { kvArrayToObject } from "./util";

const respondWith = (result: unknown) =>
  ({ request: async () => ({ result }) }) as unknown as Requester;

describe("kvArrayToObject", () => {
  test("keeps every key as a regular entry", () => {
    const res = kvArrayToObject<Record<string, unknown>>([
      "name",
      "a",
      "__proto__",
      { nested: true },
      "constructor",
      "b",
    ]);

    expect(Object.keys(res)).toEqual(["name", "__proto__", "constructor"]);
    expect(Object.values(res)).toEqual(["a", { nested: true }, "b"]);
    expect(res.nested).toBeUndefined();
  });
});

describe("stream entries with special ids", () => {
  for (const Command of [XRangeCommand, XRevRangeCommand]) {
    test(`${Command.name} returns them like any other entry`, async () => {
      const client = respondWith([
        ["__proto__", ["shared", "1"]],
        ["1-0", ["field", "value"]],
      ]);

      const res = await new Command(["key", "-", "+"]).exec(client);

      expect(Object.keys(res)).toEqual(["__proto__", "1-0"]);
      expect(Object.values(res)).toEqual([{ shared: 1 }, { field: "value" }]);
      expect(({} as Record<string, unknown>).shared).toBeUndefined();
    });
  }
});
