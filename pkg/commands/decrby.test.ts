import { keygen, newHttpClient } from "../test-utils.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { DecrByCommand } from "./decrby.ts";
import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("decrements a non-existing value", async () => {
  const key = newKey();
  const res = await new DecrByCommand([key, 2]).exec(client);

  assertEquals(res, -2);
});

Deno.test("decrements and existing value", async () => {
  const key = newKey();
  await new SetCommand([key, 5]).exec(client);
  const res = await new DecrByCommand([key, 2]).exec(client);

  assertEquals(res, 3);
});
