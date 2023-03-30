import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZRangeCommand } from "./zrange.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("returns the set", async () => {
    const key = newKey();
    const score1 = 2;
    const member1 = randomID();

    const score2 = 5;
    const member2 = randomID();

    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);

    const res = await new ZRangeCommand([key, 1, 3]).exec(client);
    assertEquals(res.length, 1);
    assertEquals(res![0], member2);
  });
});

Deno.test("withscores", async (t) => {
  await t.step("returns the set", async () => {
    const key = newKey();
    const score1 = 2;
    const member1 = randomID();

    const score2 = 5;
    const member2 = randomID();

    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);

    const res = await new ZRangeCommand([key, 1, 3, { withScores: true }]).exec(
      client,
    );
    assertEquals(res.length, 2);
    assertEquals(res![0], member2);
    assertEquals(res![1], score2);
  });
});

Deno.test("byscore", async (t) => {
  await t.step("returns the set", async () => {
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

    const res = await new ZRangeCommand([key, score1, score2, {
      byScore: true,
    }]).exec(client);

    assertEquals(res.length, 2);
    assertEquals(res![0], member1);
    assertEquals(res![1], member2);

    const res2 = await new ZRangeCommand([key, score1, score3, {
      byScore: true,
    }]).exec(client);
    assertEquals(res2.length, 3);
    assertEquals(res2![0], member1);
    assertEquals(res2![1], member2);
    assertEquals(res2![2], member3);

    const res3 = await new ZRangeCommand([key, "-inf", "+inf", {
      byScore: true,
    }]).exec(client);
    assertEquals(res3, res2);
  });
});

Deno.test("bylex", async (t) => {
  await t.step("returns the set", async () => {
    const key = newKey();

    await new ZAddCommand([
      key,
      { score: 0, member: "a" },
      { score: 0, member: "b" },
      { score: 0, member: "c" },
    ]).exec(client);

    // everything in between a and c, excluding "a" and including "c"
    const res = await new ZRangeCommand([key, "(a", "[c", { byLex: true }])
      .exec(
        client,
      );
    assertEquals(res.length, 2);
    assertEquals(res![0], "b");
    assertEquals(res![1], "c");

    //everything after "a", excluding a
    const res2 = await new ZRangeCommand([key, "(a", "+", { byLex: true }])
      .exec(
        client,
      );
    assertEquals(res2, res);

    // everything in between a and "bb", including "a" and excluding "bb"
    const res3 = await new ZRangeCommand([key, "[a", "(bb", {
      byLex: true,
    }]).exec(client);
    assertEquals(res3.length, 2);
    assertEquals(res3![0], "a");
    assertEquals(res3![1], "b");
  });
});

Deno.test("rev", async (t) => {
  await t.step("returns the set in reverse order", async () => {
    const key = newKey();
    const score1 = 2;
    const member1 = randomID();

    const score2 = 5;
    const member2 = randomID();

    await new ZAddCommand([
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);

    const res = await new ZRangeCommand([key, 0, 7, { rev: true }]).exec(
      client,
    );
    assertEquals(res.length, 2);
    assertEquals(res![0], member2);
    assertEquals(res![1], member1);
  });
});

Deno.test("limit", async (t) => {
  await t.step("returns only the first 2", async () => {
    const key = newKey();
    for (let i = 0; i < 10; i++) {
      await new ZAddCommand([
        key,
        { score: i, member: randomID() },
      ]).exec(client);
    }

    const res = await new ZRangeCommand([key, 0, 7, {
      byScore: true,
      offset: 0,
      count: 2,
    }])
      .exec(
        client,
      );
    assertEquals(res.length, 2);
  });
});
