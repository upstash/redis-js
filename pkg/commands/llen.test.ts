import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LLenCommand } from "./llen.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "when list exists",
  async (t) => {
    await t.step(
      "returns the length of the list",
      async () => {
        const key = newKey();
        await new LPushCommand([key, randomID()]).exec(client);
        const res = await new LLenCommand([key]).exec(client);
        assertEquals(res, 1);
      },
    );
  },
);

Deno.test(
  "when list does not exist",
  async (t) => {
    await t.step(
      "returns 0",
      async () => {
        const key = newKey();
        const res = await new LLenCommand([key]).exec(client);
        assertEquals(res, 0);
      },
    );
  },
);
