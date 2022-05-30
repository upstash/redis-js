import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SRandMemberCommand } from "./srandmember.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without opts", async (t) => {
  await t.step("returns a random key", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SRandMemberCommand([key]).exec(client);
    assertEquals(res, member);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns a random key", async () => {
    const key = newKey();
    const member1 = randomID();
    const member2 = randomID();
    await new SAddCommand([key, member1, member2]).exec(client);
    const res = await new SRandMemberCommand<unknown[]>([key, 2]).exec(client);
    assertEquals(res?.length, 2);
  });
});
