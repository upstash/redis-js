import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { SetBitCommand } from "./setbit.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { GetBitCommand } from "./getbit.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the bit at offset", async () => {
  const key = newKey();

  await new SetBitCommand([key, 0, 1]).exec(client);
  const res = await new GetBitCommand([key, 0]).exec(client);
  assertEquals(res, 1);
});
