import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { TypeCommand } from "./type.ts";
import { LPushCommand } from "./lpush.ts";
import { HSetCommand } from "./hset.ts";
import { SAddCommand } from "./sadd.ts";
import { ZAddCommand } from "./zadd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "string",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomID();
        await new SetCommand([key, value]).exec(client);
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "string");
      },
    );
  },
);

Deno.test(
  "list",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomID();
        await new LPushCommand([key, value]).exec(client);
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "list");
      },
    );
  },
);

Deno.test(
  "set",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomID();
        await new SAddCommand([key, value]).exec(client);
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "set");
      },
    );
  },
);

Deno.test(
  "hash",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const field = randomID();
        const value = randomID();
        await new HSetCommand([key, { [field]: value }]).exec(client);
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "hash");
      },
    );
  },
);

Deno.test(
  "zset",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const member = randomID();
        await new ZAddCommand([key, { score: 0, member }]).exec(client);
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "zset");
      },
    );
  },
);

Deno.test(
  "none",
  async (t) => {
    await t.step(
      "returns the correct type",
      async () => {
        const key = newKey();
        const res = await new TypeCommand([key]).exec(client);
        assertEquals(res, "none");
      },
    );
  },
);
