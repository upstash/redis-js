import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { LIndexCommand } from "./lindex.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  describe("when the index is in range", () => {
    it("returns the element at index", async () => {
      const key = newKey();

      const value = crypto.randomUUID();
      await new LPushCommand(key, value).exec(client);
      const res = await new LIndexCommand(key, 0).exec(client);
      assertEquals(res, value);
    });
    describe("when the index is out of bounds", () => {
      it("returns null", async () => {
        const key = newKey();

        const value = crypto.randomUUID();
        await new LPushCommand(key, value).exec(client);
        const res = await new LIndexCommand(key, 1).exec(client);
        assertEquals(res, null);
      });
    });
  });
});
