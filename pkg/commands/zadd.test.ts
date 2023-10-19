import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZScoreCommand } from "./zscore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("command format", () => {
  test("without options", () => {
    test("build the correct command", () => {
      expect(new ZAddCommand(["key", { score: 0, member: "member" }]).command, [
        "zadd",
        "key",
        0,
        "member",
      ]);
    });
  });
  test("with nx", () => {
    test("build the correct command", () => {
      expect(new ZAddCommand(["key", { nx: true }, { score: 0, member: "member" }]).command, [
        "zadd",
        "key",
        "nx",
        0,
        "member",
      ]);
    });
  });
  test("with xx", () => {
    test("build the correct command", () => {
      expect(new ZAddCommand(["key", { xx: true }, { score: 0, member: "member" }]).command, [
        "zadd",
        "key",
        "xx",
        0,
        "member",
      ]);
    });
  });
  test("with ch", () => {
    test("build the correct command", () => {
      expect(new ZAddCommand(["key", { ch: true }, { score: 0, member: "member" }]).command, [
        "zadd",
        "key",
        "ch",
        0,
        "member",
      ]);
    });
  });
  test("with incr", () => {
    test("build the correct command", () => {
      expect(new ZAddCommand(["key", { incr: true }, { score: 0, member: "member" }]).command, [
        "zadd",
        "key",
        "incr",
        0,
        "member",
      ]);
    });
  });
  test("with nx and ch", () => {
    test("build the correct command", () => {
      expect(
        new ZAddCommand(["key", { nx: true, ch: true }, { score: 0, member: "member" }]).command,
        ["zadd", "key", "nx", "ch", 0, "member"],
      );
    });
  });
  test("with nx,ch and incr", () => {
    test("build the correct command", () => {
      expect(
        new ZAddCommand(["key", { nx: true, ch: true, incr: true }, { score: 0, member: "member" }])
          .command,
        ["zadd", "key", "nx", "ch", "incr", 0, "member"],
      );
    });
  });
  test("with nx and multiple members", () => {
    test("build the correct command", () => {
      expect(
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

test("without options", () => {
  test("adds the member", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    const res = await new ZAddCommand([key, { score, member }]).exec(client);
    expect(res).toEqual(1);
  });
});

test("xx", () => {
  test("when the element exists", () => {
    test("updates the element", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([key, { xx: true }, { score: newScore, member }]).exec(
        client,
      );
      expect(res).toEqual(0);

      const res2 = await new ZScoreCommand([key, member]).exec(client);
      expect(res2).toEqual(newScore);
    });
  });
  test("when the element does not exist", () => {
    test("does nothing", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([key, { xx: true }, { score: newScore, member }]).exec(
        client,
      );
      expect(res).toEqual(0);
    });
  });
});

test("nx", () => {
  test("when the element exists", () => {
    test("does nothing", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      await new ZAddCommand([key, { score, member }]).exec(client);
      const newScore = score + 1;
      const res = await new ZAddCommand([key, { nx: true }, { score: newScore, member }]).exec(
        client,
      );
      expect(res).toEqual(0);

      const res2 = await new ZScoreCommand([key, member]).exec(client);
      expect(res2).toEqual(score);
    });
  });
  test("when the element does not exist", () => {
    test("creates element", async () => {
      const key = newKey();
      const member = randomID();
      const score = Math.floor(Math.random() * 10);
      const res = await new ZAddCommand([key, { nx: true }, { score, member }]).exec(client);
      expect(res).toEqual(1);
    });
  });
});

test("ch", () => {
  test("returns the number of changed elements", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand([key, { score, member }]).exec(client);
    const newScore = score + 1;
    const res = await new ZAddCommand([key, { ch: true }, { score: newScore, member }]).exec(
      client,
    );
    expect(res).toEqual(1);
  });
});

test("incr", () => {
  test("increments the score", async () => {
    const key = newKey();
    const member = randomID();
    const score = Math.floor(Math.random() * 10);
    await new ZAddCommand([key, { score, member }]).exec(client);
    const res = await new ZAddCommand([key, { incr: true }, { score: 1, member }]).exec(client);
    expect(typeof res, "number");
    expect(res).toEqual(score + 1);
  });
});
