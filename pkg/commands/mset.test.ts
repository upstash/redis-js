import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { MSetCommand } from "./mset.ts";
import { MGetCommand } from "./mget.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "gets exiting values",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const kv = {
      [key1]: randomID(),
      [key2]: randomID(),
    };
    const res = await new MSetCommand(kv).exec(client);

    assertEquals(res, "OK");
    const res2 = await new MGetCommand(key1, key2).exec(client);
    assertEquals(res2, Object.values(kv));
  },
);
