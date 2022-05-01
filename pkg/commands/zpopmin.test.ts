import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZPopMinCommand } from "./zpopmin.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("returns the popped elements", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();
    const score3 = 3;
    const member3 = randomID();
    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
      { score: score3, member: member3 },
    ]).exec(client);
    const res = await new ZPopMinCommand([key]).exec(client);
    assertEquals(res, [member1, score1]);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns the popped elements", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();
    const score3 = 3;
    const member3 = randomID();
    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
      { score: score3, member: member3 },
    ]).exec(client);
    const res = await new ZPopMinCommand([key, 2]).exec(client);
    assertEquals(res, [member1, score1, member2, score2]);
  });
});
