import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { MSetCommand } from "./mset.ts";
import { TouchCommand } from "./touch.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "returns the number of touched keys",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const kv: Record<string, string> = {};
    kv[key1] = randomID();
    kv[key2] = randomID();
    await new MSetCommand([kv]).exec(client);
    const res = await new TouchCommand([key1, key2]).exec(client);
    assertEquals(res, 2);
  },
);
