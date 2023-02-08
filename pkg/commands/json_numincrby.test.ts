import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonNumIncrByCommand } from "./json_numincrby.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": "b",
    "b": [{ "a": 2 }, { "a": 5 }, { "a": "c" }],
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonNumIncrByCommand([key, "$.a", 2]).exec(client);
  assertEquals(res2.sort(), [null]);
  const res3 = await new JsonNumIncrByCommand([key, "$..a", 2]).exec(client);
  assertEquals(res3.sort(), [4, 7, null, null]);
});
