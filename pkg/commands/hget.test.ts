import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "gets an exiting value",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    const value = crypto.randomUUID();
    await new HSetCommand(key, { [field]: value }).exec(client);
    const res = await new HGetCommand(key, field).exec(client);

    assertEquals(res, value);
  },
);

Deno.test(
  "gets a non-existing hash",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    const res = await new HGetCommand(key, field).exec(client);

    assertEquals(res, null);
  },
);

Deno.test(
  "gets a non-existing field",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    await new HSetCommand(key, {
      [crypto.randomUUID()]: crypto.randomUUID(),
    })
      .exec(
        client,
      );
    const res = await new HGetCommand(key, field).exec(client);

    assertEquals(res, null);
  },
);

Deno.test(
  "gets an object",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    const value = { v: crypto.randomUUID() };
    await new HSetCommand(key, { [field]: value }).exec(client);
    const res = await new HGetCommand(key, field).exec(client);

    assertEquals(res, value);
  },
);
