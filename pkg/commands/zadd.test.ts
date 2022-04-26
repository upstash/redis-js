import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZScoreCommand } from "./zscore.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("command format", () => {
  describe("without options", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand("key", { score: 0, member: "member" }).command,
        ["zadd", "key", "0", "member"],
      );
    });
  });
  describe("with nx", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand("key", { nx: true }, { score: 0, member: "member" })
          .command,
        ["zadd", "key", "nx", "0", "member"],
      );
    });
  });
  describe("with xx", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand("key", { xx: true }, { score: 0, member: "member" })
          .command,
        ["zadd", "key", "xx", "0", "member"],
      );
    });
  });
  describe("with ch", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand("key", { ch: true }, { score: 0, member: "member" })
          .command,
        ["zadd", "key", "ch", "0", "member"],
      );
    });
  });
  describe("with incr", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand("key", { incr: true }, { score: 0, member: "member" })
          .command,
        ["zadd", "key", "incr", "0", "member"],
      );
    });
  });
  describe("with nx and ch", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand(
          "key",
          { nx: true, ch: true },
          { score: 0, member: "member" },
        ).command,
        ["zadd", "key", "nx", "ch", "0", "member"],
      );
    });
  });
  describe("with nx,ch and incr", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand(
          "key",
          { nx: true, ch: true, incr: true },
          { score: 0, member: "member" },
        ).command,
        ["zadd", "key", "nx", "ch", "incr", "0", "member"],
      );
    });
  });
  describe("with nx and multiple members", () => {
    it("build the correct command", () => {
      assertEquals(
        new ZAddCommand(
          "key",
          { nx: true },
          { score: 0, member: "member" },
          { score: 1, member: "member1" },
        ).command,
        ["zadd", "key", "nx", "0", "member", "1", "member1"],
      );
    });
  });
});

describe("without options", () => {
  it("adds the member", async () => {
    const key = newKey();
    const member = Math.random().toString();
    const score = Math.floor(Math.random() * 10);
    const res = await new ZAddCommand(key, { score, member }).exec(client);
    assertEquals(res, 1);
  });
});

describe("xx", () => {
  describe("when the element exists", () => {
    it("updates the element", async () => {
      const key = newKey();
      const member = Math.random().toString();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand(key, { score, member }).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand(
        key,
        { xx: true },
        { score: newScore, member },
      ).exec(client);
      assertEquals(res, 0);

      const res2 = await new ZScoreCommand(key, member).exec(client);
      assertEquals(res2, newScore);
    });
  });
  describe("when the element does not exist", () => {
    it("does nothing", async () => {
      const key = newKey();
      const member = Math.random().toString();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand(key, { score, member }).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand(
        key,
        { xx: true },
        { score: newScore, member },
      ).exec(client);
      assertEquals(res, 0);
    });
  });
});

describe("nx", () => {
  describe("when the element exists", () => {
    it("does nothing", async () => {
      const key = newKey();
      const member = Math.random().toString();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand(key, { score, member }).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand(
        key,
        { nx: true },
        { score: newScore, member },
      ).exec(client);
      assertEquals(res, 0);

      const res2 = await new ZScoreCommand(key, member).exec(client);
      assertEquals(res2, score);
    });
  });
  describe("when the element does not exist", () => {
    it("creates element", async () => {
      const key = newKey();
      const member = Math.random().toString();
      const score = Math.floor(Math.random() * 10);
      const res = await new ZAddCommand(
        key,
        { nx: true },
        { score, member },
      ).exec(client);
      assertEquals(res, 1);
    });
  });
});

describe("ch", () => {
  it("returns the number of changed elements", async () => {
    const key = newKey();
    const member = Math.random().toString();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand(key, { score, member }).exec(client);
    const newScore = score + 1;
    const res = await new ZAddCommand(
      key,
      { ch: true },
      { score: newScore, member },
    ).exec(client);
    assertEquals(res, 1);
  });
});

describe("incr", () => {
  it("returns the number of changed elements", async () => {
    const key = newKey();
    const member = Math.random().toString();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand(key, { score, member }).exec(client);
    const newScore = score + 1;
    const res = await new ZAddCommand(
      key,
      { ch: true },
      { score: newScore, member },
    ).exec(client);
    assertEquals(res, 1);
  });
});
