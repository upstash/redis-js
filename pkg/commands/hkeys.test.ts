import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HMSetCommand } from "./hmset.ts";
import { HKeysCommand } from "./hkeys.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "with existing hash",
  () => {
    it(
      "returns all keys",
      async () => {
        const key = newKey();
        const kv = {
          [Math.random().toString()]: Math.random().toString(),
          [Math.random().toString()]: Math.random().toString(),
        };
        await new HMSetCommand(key, kv).exec(client);
        const res = await new HKeysCommand(key).exec(client);
        assertEquals(res.sort(), Object.keys(kv).sort());
      },
    );
  },
);
