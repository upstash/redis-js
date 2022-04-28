import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HMSetCommand } from "./hmset.ts";
import { HKeysCommand } from "./hkeys.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "with existing hash",
  async (t) => {
    await t.step(
      "returns all keys",
      async () => {
        const key = newKey();
        const kv = {
          [randomID()]: randomID(),
          [randomID()]: randomID(),
        };
        await new HMSetCommand(key, kv).exec(client);
        const res = await new HKeysCommand(key).exec(client);
        assertEquals(res.sort(), Object.keys(kv).sort());
      },
    );
  },
);
