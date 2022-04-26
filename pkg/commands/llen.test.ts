import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LLenCommand } from "./llen.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "when list exists",
  () => {
    it(
      "returns the length of the list",
      async () => {
        const key = newKey();
        await new LPushCommand(key, crypto.randomUUID()).exec(client);
        const res = await new LLenCommand(key).exec(client);
        assertEquals(res, 1);
      },
    );
  },
);

describe(
  "when list does not exist",
  () => {
    it(
      "returns 0",
      async () => {
        const key = newKey();
        const res = await new LLenCommand(key).exec(client);
        assertEquals(res, 0);
      },
    );
  },
);
