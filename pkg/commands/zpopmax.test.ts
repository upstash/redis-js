import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZPopMaxCommand } from "./zpopmax.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("returns the max", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();
    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);
    const res = await new ZPopMaxCommand([key]).exec(client);
    assertEquals(res.length, 2);
    assertEquals(res![0], member2);
    assertEquals(res![1], score2);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns the n max members", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();
    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);
    const res = await new ZPopMaxCommand([key, 2]).exec(client);
    assertEquals(res, [member2, score2, member1, score1]);
  });
});
