import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SDiffCommand } from "./sdiff.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "returns the diff",
  async () => {
    const key1 = newKey();
    const member1 = randomID();
    const key2 = newKey();
    const member2 = randomID();
    await new SAddCommand([key1, member1]).exec(client);
    await new SAddCommand([key2, member2]).exec(client);
    const res = await new SDiffCommand([key1, key2]).exec(client);
    assertEquals(res, [member1]);
  },
);
