import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonTypeCommand } from "./json_type.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": 2,
    "nested": { "a": true },
    "foo": "bar",
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonTypeCommand([key, "$..foo"]).exec(client);
  assertEquals(res2.sort(), ["string"]);
  const res3 = await new JsonTypeCommand([key, "$..a"]).exec(client);
  assertEquals(res3.sort(), ["boolean", "integer"]);
});
