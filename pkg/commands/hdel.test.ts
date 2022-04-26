import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HDelCommand } from "./hdel.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "deletes a hash that does not exist",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    const res = await new HDelCommand(key, field).exec(client);

    assertEquals(res, 0);
  },
);

it(
  "deletes a field that exists",
  async () => {
    const key = newKey();
    const field = crypto.randomUUID();
    await new HSetCommand(key, { [field]: crypto.randomUUID() }).exec(client);
    const res = await new HDelCommand(key, field).exec(client);

    assertEquals(res, 1);
    const res2 = await new HGetCommand(key, field).exec(client);

    assertEquals(res2, null);
  },
);
