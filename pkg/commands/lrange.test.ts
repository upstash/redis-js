import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { RPushCommand } from "./rpush.ts";
import { LRangeCommand } from "./lrange.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the correct range",
  async () => {
    const key = newKey();
    const value1 = Math.random().toString();
    const value2 = Math.random().toString();
    const value3 = Math.random().toString();
    await new RPushCommand(key, value1, value2, value3).exec(client);
    const res = await new LRangeCommand(key, 1, 2).exec(client);
    assertEquals(res!.length, 2);
    assertEquals(res![0], value2);
    assertEquals(res![1], value3);
  },
);
