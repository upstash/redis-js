import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
import { LRemCommand } from "./lrem.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "returns the number of deleted elements",
  async () => {
    const key = newKey();
    await new LPushCommand([key, "element"]).exec(client);
    await new LPushCommand([key, "element"]).exec(client);
    await new LPushCommand([key, "something else"]).exec(client);

    const res = await new LRemCommand([key, 2, "element"]).exec(client);
    assertEquals(res, 2);
  },
);
