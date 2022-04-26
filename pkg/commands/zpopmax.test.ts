import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZPopMaxCommand } from "./zpopmax.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  it("returns the max", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = crypto.randomUUID();
    const score2 = 2;
    const member2 = crypto.randomUUID();
    await new ZAddCommand(
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ).exec(client);
    const res = await new ZPopMaxCommand(key).exec(client);
    assertEquals(res.length, 2);
    assertEquals(res![0], member2);
    assertEquals(res![1], score2);
  });
});

describe("with count", () => {
  it("returns the n max members", async () => {
    const key = newKey();
    const score1 = 1;
    const member1 = crypto.randomUUID();
    const score2 = 2;
    const member2 = crypto.randomUUID();
    await new ZAddCommand(
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ).exec(client);
    const res = await new ZPopMaxCommand(key, 2).exec(client);
    assertEquals(res, [member2, score2, member1, score1]);
  });
});
