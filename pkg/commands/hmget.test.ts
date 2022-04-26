import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { HMSetCommand } from "./hmset.ts";
import { HMGetCommand } from "./hmget.ts";
import { HSetCommand } from "./hset.ts";
const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets exiting values",
  async () => {
    const key = newKey();
    const field1 = Math.random().toString();
    const value1 = Math.random().toString();
    const field2 = Math.random().toString();
    const value2 = Math.random().toString();
    const kv: Record<string, string> = { [field1]: value1, [field2]: value2 };
    const res = await new HMSetCommand(key, kv).exec(client);

    assertEquals(res, "OK");
    const res2 = await new HMGetCommand(key, field1, field2).exec(client);

    assertEquals(res2, kv);
  },
);

describe(
  "when the hash does not exist",
  () => {
    it(
      "returns null",
      async () => {
        const key = newKey();
        const res = await new HMGetCommand(key, Math.random().toString()).exec(
          client,
        );

        assertEquals(res, null);
      },
    );
  },
);

it(
  "gets an object",
  async () => {
    const key = newKey();
    const field = Math.random().toString();
    const value = { v: Math.random().toString() };
    await new HSetCommand(key, { [field]: value }).exec(client);
    const cmd = new HMGetCommand(key, field);
    const res = await cmd.exec(client);
    assertEquals(res, { [field]: value });
  },
);
