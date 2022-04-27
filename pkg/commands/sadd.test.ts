import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the number of added members",
  async () => {
    const key = newKey();
    const value1 = crypto.randomUUID();
    const value2 = crypto.randomUUID();
    const res = await new SAddCommand(key, value1, value2).exec(client);
    assertEquals(res, 2);
  },
);
