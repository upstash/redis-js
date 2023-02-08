import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonStrLenCommand } from "./json_strlen.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": "foo",
    "nested": { "a": "hello" },
    "nested2": { "a": 31 },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonStrLenCommand([key, "$..a"]).exec(client);
  assertEquals(res2.sort(), [3, 5, null]);
});
