import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the length after command", async () => {
  const key = newKey();
  const res = await new LPushCommand([key, randomID()]).exec(
    client,
  );
  assertEquals(res, 1);
  const res2 = await new LPushCommand([
    key,
    randomID(),
    randomID(),
  ]).exec(client);

  assertEquals(res2, 3);
});
