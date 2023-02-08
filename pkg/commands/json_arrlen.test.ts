import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonArrLenCommand } from "./json_arrlen.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Get lengths of JSON arrays in a document", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "name": "Wireless earbuds",
    "description": "Wireless Bluetooth in-ear headphones",
    "connection": { "wireless": true, "type": "Bluetooth" },
    "price": 64.99,
    "stock": 17,
    "colors": ["black", "white"],
    "max_level": [80, 100, 120],
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonArrLenCommand([key, "$.max_level"]).exec(client);
  assertEquals(res2, [3]);
});
