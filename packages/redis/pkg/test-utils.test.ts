import { expect, test } from "bun:test";

import { randomUnsafeIntegerString } from "./test-utils";

test("randomUnsafeIntegerString() should return a string", () => {
  const result = randomUnsafeIntegerString();
  expect(typeof result).toEqual("string");
});
test("randomUnsafeIntegerString() should return different values", () => {
  const result1 = randomUnsafeIntegerString();
  const result2 = randomUnsafeIntegerString();
  expect(result1).not.toEqual(result2);
});
test("randomUnsafeIntegerString() should return a string with unsafe integer", () => {
  const result = randomUnsafeIntegerString();
  expect(Number.isSafeInteger(Number(result))).toBeFalse();
});
