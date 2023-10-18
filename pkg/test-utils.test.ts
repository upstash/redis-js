import {
  assertEquals,
  assertFalse,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { randomUnsafeIntegerString } from "./test-utils.ts";

Deno.test("randomUnsafeIntegerString() should return a string", () => {
  const result = randomUnsafeIntegerString();
  assertEquals(typeof result, "string");
});
Deno.test("randomUnsafeIntegerString() should return different values", () => {
  const result1 = randomUnsafeIntegerString();
  const result2 = randomUnsafeIntegerString();
  assertEquals(result1 !== result2, true);
});
Deno.test(
  "randomUnsafeIntegerString() should return a string with unsafe integer",
  () => {
    const result = randomUnsafeIntegerString();
    assertFalse(Number.isSafeInteger(Number(result)));
  },
);
