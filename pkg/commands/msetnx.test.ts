import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { MGetCommand } from "./mget.ts";
import { SetCommand } from "./set.ts";
import { GetCommand } from "./get.ts";
import { MSetNXCommand } from "./msetnx.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "sets values",
  async () => {
    const key1 = newKey();
    const value1 = Math.random().toString();
    const key2 = newKey();
    const value2 = Math.random().toString();

    const kv: Record<string, string> = {};
    kv[key1] = value1;
    kv[key2] = value2;
    const res = await new MSetNXCommand(kv).exec(client);

    assertEquals(res, 1);
    const res2 = await new MGetCommand<[string, string]>(key1, key2).exec(
      client,
    );

    assertEquals(res2, [value1, value2]);
  },
);

it(
  "does not set values if one key already exists",
  async () => {
    const key1 = newKey();
    const value1 = Math.random().toString();
    const key2 = newKey();
    const value2 = Math.random().toString();
    await new SetCommand(key1, value1).exec(client);
    const kv: Record<string, string> = {};
    kv[key1] = value1;
    kv[key2] = value2;
    const res = await new MSetNXCommand(kv).exec(client);

    assertEquals(res, 0);

    const res2 = await new GetCommand(key2).exec(client);

    assertEquals(res2, null);
  },
);
