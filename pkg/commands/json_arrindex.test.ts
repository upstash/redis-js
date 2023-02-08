import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonArrAppendCommand } from "./json_arrappend.ts";
import { JsonGetCommand } from "./json_get.ts";
import { JsonArrInsertCommand } from "./json_arrinsert.ts";
import { JsonArrIndexCommand } from "./json_arrindex.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Find the specific place of a color in a list of product colors", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "name": "Noise-cancelling Bluetooth headphones",
    "description":
      "Wireless Bluetooth headphones with noise-cancelling technology",
    "connection": { "wireless": true, "type": "Bluetooth" },
    "price": 99.98,
    "stock": 25,
    "colors": ["black", "silver"],
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonArrAppendCommand([key, "$.colors", '"blue"']).exec(
    client,
  );
  assertEquals(res2, [3]);
  const res3 = await new JsonGetCommand([key]).exec(client);
  assertEquals(res3, {
    "name": "Noise-cancelling Bluetooth headphones",
    "description":
      "Wireless Bluetooth headphones with noise-cancelling technology",
    "connection": { "wireless": true, "type": "Bluetooth" },
    "price": 99.98,
    "stock": 25,
    "colors": ["black", "silver", "blue"],
  });
  const res4 = await new JsonGetCommand([key, "$.colors[*]"]).exec(client);
  assertEquals(res4, ["black", "silver", "blue"]);

  const res5 = await new JsonArrInsertCommand([
    key,
    "$.colors",
    2,
    '"yellow"',
    '"gold"',
  ]).exec(client);
  assertEquals(res5, [5]);
  const res6 = await new JsonGetCommand([key, "$.colors"]).exec(client);
  assertEquals(res6, [["black", "silver", "yellow", "gold", "blue"]]);

  const res7 = await new JsonArrIndexCommand([key, "$..colors", '"silver"'])
    .exec(client);
  assertEquals(res7, [1]);
});
