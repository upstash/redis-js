import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { HStrLenCommand } from "./hstrlen.ts";
import { HSetCommand } from "./hset.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test(
  "returns correct length",
  async () => {
    const key = newKey();
    const field = randomID();
    const value = randomID();

    const res = await new HStrLenCommand([key, field]).exec(client);
    assertEquals(res, 0);
    await new HSetCommand([key, { [field]: value }]).exec(client);

    const res2 = await new HStrLenCommand([key, field]).exec(client);

    assertEquals(res2, value.length);
  },
);
