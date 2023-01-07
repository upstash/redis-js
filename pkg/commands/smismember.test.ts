import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { SAddCommand } from "./sadd.ts";
import { SMIsMemberCommand } from "./smismember.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when member exists", async (t) => {
  await t.step("returns 1", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new SAddCommand([key, value1]).exec(client);
    await new SAddCommand([key, value2]).exec(client);
    const res = await new SMIsMemberCommand([key, value1, randomID()]).exec(
      client,
    );
    assertEquals(res, [1, 0]);
  });
});
