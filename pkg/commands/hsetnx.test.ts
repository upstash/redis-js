import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";
import { HSetNXCommand } from "./hsetnx.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "when hash exists already",
  async (t) => {
    await t.step(
      "returns 0",
      async () => {
        const key = newKey();
        const field = randomID();
        const value = randomID();
        const newValue = randomID();
        await new HSetCommand([key, { [field]: value }]).exec(client);
        const res = await new HSetNXCommand([key, field, newValue]).exec(
          client,
        );
        assertEquals(res, 0);
        const res2 = await new HGetCommand([key, field]).exec(client);

        assertEquals(res2, value);
      },
    );
  },
);
Deno.test(
  "when hash does not exist",
  async (t) => {
    await t.step(
      "returns 1",
      async () => {
        const key = newKey();
        const field = randomID();
        const value = randomID();
        const res = await new HSetNXCommand([key, field, value]).exec(client);
        assertEquals(res, 1);
        const res2 = await new HGetCommand([key, field]).exec(client);

        assertEquals(res2, value);
      },
    );
  },
);
