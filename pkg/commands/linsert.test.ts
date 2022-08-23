import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { LInsertCommand } from "./linsert.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { LPushCommand } from "./lpush.ts";
import { LRangeCommand } from "./lrange.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("adds the element", async () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  await new LPushCommand([key, value1]).exec(client);
  const res = await new LInsertCommand([key, "before", value1, value2]).exec(
    client,
  );
  assertEquals(res, 2);

  const list = await new LRangeCommand([key, 0, -1]).exec(client);
  assertEquals(list, [value2, value1]);
});
