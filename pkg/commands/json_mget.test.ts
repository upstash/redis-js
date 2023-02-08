import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { JsonMGetCommand } from "./json_mget.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Return the values at path from multiple key arguments", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const res1 = await new JsonSetCommand([key1, "$", {
    a: 1,
    b: 2,
    nested: { a: 3 },
    c: null,
  }]).exec(client);
  assertEquals(res1, "OK");

  const res2 = await new JsonSetCommand([key2, "$", {
    a: 4,
    b: 5,
    nested: { a: 6 },
    c: null,
  }]).exec(client);
  assertEquals(res2, "OK");
  const res3 = await new JsonMGetCommand([[key1, key2], "$..a"]).exec(client);
  assertEquals(res3, [[3, 1], [6, 4]]);
});
