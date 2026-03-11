import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZPopMinCommand } from "./zpopmin";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("returns the popped elements", async () => {
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
    expect(res).toEqual([member1, score1]);
  });
});

describe("with count", () => {
  test("returns the popped elements", async () => {
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
    expect(res).toEqual([member1, score1, member2, score2]);
  });
});
