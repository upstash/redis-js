import { assertFalse } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { randomUnsafeIntegerString } from "./test-utils.ts";

Deno.test("randomUnsafeIntegerString() return unsafe integer string", () => {
  const unsafeIntegerString = randomUnsafeIntegerString();
  assertFalse(Number.isSafeInteger(unsafeIntegerString));
});
