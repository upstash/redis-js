import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZScoreCommand } from "./zscore.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("command format", async (t) => {
  await t.step("without options", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand(["key", { score: 0, member: "member" }]).command,
        ["zadd", "key", 0, "member"],
      );
    });
  });
  await t.step("with nx", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand(["key", { nx: true }, { score: 0, member: "member" }])
          .command,
        ["zadd", "key", "nx", 0, "member"],
      );
    });
  });
  await t.step("with xx", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand(["key", { xx: true }, { score: 0, member: "member" }])
          .command,
        ["zadd", "key", "xx", 0, "member"],
      );
    });
  });
  await t.step("with ch", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand(["key", { ch: true }, { score: 0, member: "member" }])
          .command,
        ["zadd", "key", "ch", 0, "member"],
      );
    });
  });
  await t.step("with incr", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand(["key", { incr: true }, { score: 0, member: "member" }])
          .command,
        ["zadd", "key", "incr", 0, "member"],
      );
    });
  });
  await t.step("with nx and ch", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand([
          "key",
          { nx: true, ch: true },
          { score: 0, member: "member" },
        ]).command,
        ["zadd", "key", "nx", "ch", 0, "member"],
      );
    });
  });
  await t.step("with nx,ch and incr", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand([
          "key",
          { nx: true, ch: true, incr: true },
          { score: 0, member: "member" },
        ]).command,
        ["zadd", "key", "nx", "ch", "incr", 0, "member"],
      );
    });
  });
  await t.step("with nx and multiple members", async (t) => {
    await t.step("build the correct command", () => {
      assertEquals(
        new ZAddCommand([
          "key",
          { nx: true },
          { score: 0, member: "member" },
          { score: 1, member: "member1" },
        ]).command,
        ["zadd", "key", "nx", 0, "member", 1, "member1"],
      );
    });
  });
});

Deno.test("without options", async (t) => {
  await t.step("adds the member", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    const res = await new ZAddCommand([key, { score, member }]).exec(client);
    assertEquals(res, 1);
  });
});

Deno.test("xx", async (t) => {
  await t.step("when the element exists", async (t) => {
    await t.step("updates the element", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([
        key,
        { xx: true },
        { score: newScore, member },
      ]).exec(client);
      assertEquals(res, 0);

      const res2 = await new ZScoreCommand([key, member]).exec(client);
      assertEquals(res2, newScore);
    });
  });
  await t.step("when the element does not exist", async (t) => {
    await t.step("does nothing", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([
        key,
        { xx: true },
        { score: newScore, member },
      ]).exec(client);
      assertEquals(res, 0);
    });
  });
});

Deno.test("nx", async (t) => {
  await t.step("when the element exists", async (t) => {
    await t.step("does nothing", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([
        key,
        { nx: true },
        { score: newScore, member },
      ]).exec(client);
      assertEquals(res, 0);

      const res2 = await new ZScoreCommand([key, member]).exec(client);
      assertEquals(res2, score);
    });
  });
  await t.step("when the element does not exist", async (t) => {
    await t.step("creates element", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      const res = await new ZAddCommand([
        key,
        { nx: true },
        { score, member },
      ]).exec(client);
      assertEquals(res, 1);
    });
  });
});

Deno.test("ch", async (t) => {
  await t.step("returns the number of changed elements", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand([key, { score, member }]).exec(client);
    const newScore = score + 1;
    const res = await new ZAddCommand([
      key,
      { ch: true },
      { score: newScore, member },
    ]).exec(client);
    assertEquals(res, 1);
  });
});

Deno.test("incr", async (t) => {
  await t.step("increments the score", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand([key, { score, member }]).exec(client);
    const res = await new ZAddCommand([
      key,
      { incr: true },
      { score: 1, member },
    ]).exec(client);
    assertEquals(typeof res, "number");
    assertEquals(res, score + 1);
  });
});
