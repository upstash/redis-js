import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { StrLenCommand } from "./strlen.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the correct length", async () => {
  const key = newKey();
  const value = "abcd";
  await new SetCommand([key, value]).exec(client);
  const res = await new StrLenCommand([key]).exec(client);
  assertEquals(res, value.length);
});
