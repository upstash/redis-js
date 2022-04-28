import { keygen, newHttpClient } from "../test-utils.ts";

import { SAddCommand } from "./sadd.ts";
import { SIsMemberCommand } from "./sismember.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when member exists", async (t) => {
  await t.step("returns 1", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new SAddCommand(key, value).exec(client);
    const res = await new SIsMemberCommand(key, value).exec(client);
    assertEquals(res, 1);
  });
});

Deno.test("when member exists", async (t) => {
  await t.step("returns 1", async () => {
    const key = newKey();
    const value1 = crypto.randomUUID();
    const value2 = crypto.randomUUID();
    await new SAddCommand(key, value1).exec(client);
    const res = await new SIsMemberCommand(key, value2).exec(client);
    assertEquals(res, 0);
  });
});
