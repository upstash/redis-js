import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { SetBitCommand } from "./setbit.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the original bit", async () => {
  const key = newKey();
  const res = await new SetBitCommand([key, 0, 1]).exec(client);
  assertEquals(res, 0);
  const res2 = await new SetBitCommand([key, 0, 1]).exec(client);

  assertEquals(res2, 1);
});
