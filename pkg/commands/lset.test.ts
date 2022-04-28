import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { LSetCommand } from "./lset.ts";
import { LPopCommand } from "./lpop.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when list exists", async (t) => {
  await t.step("when the index is in range", async (t) => {
    await t.step("replaces the element at index", async () => {
      const key = newKey();

      const value = crypto.randomUUID();
      const newValue = crypto.randomUUID();
      await new LPushCommand(key, value).exec(client);
      const res = await new LSetCommand(key, newValue, 0).exec(client);
      assertEquals(res, "OK");

      const res2 = await new LPopCommand(key).exec(client);

      assertEquals(res2, newValue);
    });
    await t.step("when the index is out of bounds", async (t) => {
      await t.step("returns null", async () => {
        const key = newKey();

        const value = crypto.randomUUID();
        const newValue = crypto.randomUUID();
        await new LPushCommand(key, value).exec(client);
        await assertRejects(() =>
          new LSetCommand(key, newValue, 1).exec(client)
        );
      });
    });
  });
});
