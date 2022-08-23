import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SUnionCommand } from "./sunion.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the union", async () => {
  const key1 = newKey();
  const key2 = newKey();

  const member1 = randomID();
  const member2 = randomID();

  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SUnionCommand([key1, key2]).exec(client);
  assertEquals(res?.sort(), [member1, member2].sort());
});
