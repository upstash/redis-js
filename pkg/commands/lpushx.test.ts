import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LPushXCommand } from "./lpushx.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  it("returns the length after command", async () => {
    const key = newKey();
    await new LPushCommand(key, crypto.randomUUID()).exec(client);
    const res = await new LPushXCommand(key, crypto.randomUUID()).exec(
      client,
    );
    assertEquals(res, 2);
    const res2 = await new LPushXCommand(
      key,
      crypto.randomUUID(),
      crypto.randomUUID(),
    ).exec(client);

    assertEquals(res2, 4);
  });
});

describe("when list does not exist", () => {
  it("does nothing", async () => {
    const key = newKey();
    const res = await new LPushXCommand(key, crypto.randomUUID()).exec(
      client,
    );
    assertEquals(res, 0);
  });
});
