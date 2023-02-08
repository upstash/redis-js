import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonNumMultByCommand } from "./json_nummultby.ts";

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
  const res2 = await new JsonNumMultByCommand([key, "$.a", 2]).exec(client);
  assertEquals(res2.sort(), [null]);
  const res3 = await new JsonNumMultByCommand([key, "$..a", 2]).exec(client);
  assertEquals(res3.sort(), [10, 4, null, null]);
});
