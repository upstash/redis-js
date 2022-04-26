import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SRandMemberCommand } from "./srandmember.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without opts", () => {
  it("returns a random key", async () => {
    const key = newKey();
    const member = crypto.randomUUID();
    await new SAddCommand(key, member).exec(client);
    const res = await new SRandMemberCommand(key).exec(client);
    assertEquals(res, member);
  });
});

describe("with count", () => {
  it("returns a random key", async () => {
    const key = newKey();
    const member1 = crypto.randomUUID();
    const member2 = crypto.randomUUID();
    await new SAddCommand(key, member1, member2).exec(client);
    const res = await new SRandMemberCommand<unknown[]>(key, 2).exec(client);
    assertEquals(res?.length, 2);
  });
});
