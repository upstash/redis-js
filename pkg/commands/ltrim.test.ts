import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { LTrimCommand } from "./ltrim.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when the list exists", () => {
  it("returns ok", async () => {
    const key = newKey();
    await new LPushCommand(key, Math.random().toString()).exec(client);
    await new LPushCommand(key, Math.random().toString()).exec(client);
    await new LPushCommand(key, Math.random().toString()).exec(client);
    const res = await new LTrimCommand(key, 1, 2).exec(client);
    assertEquals(res, "OK");
  });
});

describe("when the list does not exist", () => {
  it("returns ok", async () => {
    const key = newKey();

    const res = await new LTrimCommand(key, 1, 2).exec(client);
    assertEquals(res, "OK");
  });
});
