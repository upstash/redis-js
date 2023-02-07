import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonGetCommand } from "./json_get.ts";
import { JsonStrAppendCommand } from "./json_strappend.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Add 'baz' to existing string", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": "foo",
    "nested": { "a": "hello" },
    "nested2": { "a": 31 },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonStrAppendCommand([key, "$..a", '"baz"']).exec(
    client,
  );
  assertEquals(res2.sort(), [6, 8, null]);
  const res3 = await new JsonGetCommand([key]).exec(client);
  assertEquals(res3, {
    "a": "foobaz",
    "nested": { "a": "hellobaz" },
    "nested2": { "a": 31 },
  });
});
