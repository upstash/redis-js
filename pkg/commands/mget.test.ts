import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { MSetCommand } from "./mset.ts";
import { MGetCommand } from "./mget.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets exiting values",
  async () => {
    const key1 = newKey();
    const value1 = Math.random().toString();
    const key2 = newKey();
    const value2 = Math.random().toString();

    const kv: Record<string, string> = {};
    kv[key1] = value1;
    kv[key2] = value2;
    const res = await new MSetCommand(kv).exec(client);

    assertEquals(res, "OK");
    const res2 = await new MGetCommand<[string, string]>(key1, key2).exec(
      client,
    );

    assertEquals(res2, [value1, value2]);
  },
);

it(
  "gets a non-existing value",
  async () => {
    const key = newKey();
    const res = await new MGetCommand<[null]>(key).exec(client);

    assertEquals(res, [null]);
  },
);

it(
  "gets an object",
  async () => {
    const key = newKey();
    const value = { v: Math.random().toString() };
    await new SetCommand(key, value).exec(client);
    const res = await new MGetCommand<[{ v: string }]>(key).exec(client);

    assertEquals(res, [value]);
  },
);
