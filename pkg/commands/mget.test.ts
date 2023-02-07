import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { MSetCommand } from "./mset.ts";
import { MGetCommand } from "./mget.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("gets exiting values", async () => {
  const key1 = newKey();
  const value1 = randomID();
  const key2 = newKey();
  const value2 = randomID();

  const kv: Record<string, string> = {};
  kv[key1] = value1;
  kv[key2] = value2;
  const res = await new MSetCommand([kv]).exec(client);

  assertEquals(res, "OK");
  const res2 = await new MGetCommand<[string, string]>([key1, key2]).exec(
    client,
  );

  assertEquals(res2, [value1, value2]);
});

Deno.test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new MGetCommand<[null]>([key]).exec(client);

  assertEquals(res, [null]);
});

Deno.test("gets an object", async () => {
  const key = newKey();
  const value = { v: randomID() };
  await new SetCommand([key, value]).exec(client);
  const res = await new MGetCommand<[{ v: string }]>([key]).exec(client);

  assertEquals(res, [value]);
});
