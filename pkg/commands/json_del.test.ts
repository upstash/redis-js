import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { JsonGetCommand } from "./json_get.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonDelCommand } from "./json_del.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Delete a value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    a: 1,
    nested: { a: 2, b: 3 },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonDelCommand([key, "$..a"]).exec(client);
  assertEquals(res2, 2);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res3, [{ nested: { b: 3 } }]);
});
