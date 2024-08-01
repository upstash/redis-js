import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZPopMaxCommand } from "./zpopmax";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("returns the max", async () => {
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
    expect(res.length).toBe(2);
    expect(res[0]).toEqual(member2);
    expect(res[1]).toEqual(score2);
  });
});

describe("with count", () => {
  test("returns the n max members", async () => {
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
    expect(res).toEqual([member2, score2, member1, score1]);
  });
});
