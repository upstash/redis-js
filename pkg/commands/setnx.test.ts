import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { GetCommand } from "./get.ts";
import { SetNxCommand } from "./setnx.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "sets value",
  async () => {
    const key = newKey();
    const value = randomID();
    const newValue = randomID();

    const res = await new SetCommand([key, value]).exec(client);

    assertEquals(res, "OK");
    const res2 = await new SetNxCommand([key, newValue]).exec(client);

    assertEquals(res2, 0);
    const res3 = await new GetCommand([key]).exec(client);

    assertEquals(res3, value);
  },
);
