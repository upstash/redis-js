import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { SetBitCommand } from "./setbit.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("returns the original bit", async () => {
  const key = newKey();
  const res = await new SetBitCommand(key, 0, 1).exec(client);
  assertEquals(res, 0);
  const res2 = await new SetBitCommand(key, 0, 1).exec(client);

  assertEquals(res2, 1);
});
