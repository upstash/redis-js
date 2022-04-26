import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { MSetCommand } from "./mset.ts";
import { UnlinkCommand } from "./unlink.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "unlinks the keys",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const key3 = newKey();
    const kv: Record<string, string> = {};
    kv[key1] = Math.random().toString();
    kv[key2] = Math.random().toString();
    await new MSetCommand(kv).exec(client);
    const res = await new UnlinkCommand(key1, key2, key3).exec(client);
    assertEquals(res, 2);
  },
);
