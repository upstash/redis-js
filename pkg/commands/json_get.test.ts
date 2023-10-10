import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { JsonGetCommand } from "./json_get.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Return the value at path in JSON serialized form", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": 2,
    "b": 3,
    "nested": { "a": 4, "b": null },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonGetCommand([key, "$..b"]).exec(client);
  assertEquals(res2, [null, 3]);
  const res3 = await new JsonGetCommand([key, "$..a", "$..b"]).exec(client);
  assertEquals(res3, { "$..b": [null, 3], "$..a": [4, 2] });
});
