import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { RPopCommand } from "./rpop.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  it("returns the first element", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new LPushCommand(key, value).exec(client);
    const res = await new RPopCommand(key).exec(client);
    assertEquals(res, value);
  });
});

describe("when list does not exist", () => {
  it("returns null", async () => {
    const key = newKey();
    const res = await new RPopCommand(key).exec(client);
    assertEquals(res, null);
  });
});
