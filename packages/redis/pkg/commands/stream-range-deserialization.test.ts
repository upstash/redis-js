import { expect, test } from "bun:test";
import type { Requester } from "../http";
import { XRangeCommand } from "./xrange";
import { XRevRangeCommand } from "./xrevrange";

test.each([
  ["XRANGE", new XRangeCommand(["orders", "-", "+"])],
  ["XREVRANGE", new XRevRangeCommand(["orders", "+", "-"])],
] as const)("%s preserves large integer field values while parsing decimals", async (_, command) => {
  const result = [["1-0", ["orderId", "9007199254740993", "price", "12.5"]]];
  const requester: Requester = {
    request: async <TResult>() => ({ result: result as TResult }),
  };

  expect(await command.exec(requester)).toEqual({
    "1-0": { orderId: "9007199254740993", price: 12.5 },
  });
});
