import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { SUnionStoreCommand } from "./sunionstore.ts";
import { SMembersCommand } from "./smembers.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("writes the union to destination", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const dest = newKey();

  const member1 = randomID();
  const member2 = randomID();

  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SUnionStoreCommand([dest, key1, key2]).exec(client);
  assertEquals(res, 2);

  const res2 = await new SMembersCommand([dest]).exec(client);

  assertExists(res2);
  assertEquals(res2!.sort(), [member1, member2].sort());
});
