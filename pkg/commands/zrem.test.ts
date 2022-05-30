import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZRemCommand } from "./zrem.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the number of removed members", async () => {
  const key = newKey();
  const member1 = randomID();
  const member2 = randomID();
  await new ZAddCommand([
    key,
    { score: 1, member: member1 },
    { score: 2, member: member2 },
  ]).exec(client);
  const res = await new ZRemCommand([key, member1, member2]).exec(client);
  assertEquals(res, 2);
});
