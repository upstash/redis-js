import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonArrAppendCommand } from "./json_arrappend.ts";
import { JsonGetCommand } from "./json_get.ts";
import { JsonArrTrimCommand } from "./json_arrtrim.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Trim an array to a specific set of values", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    a: [1],
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonArrAppendCommand([key, "$.a", 2]).exec(client);
  assertEquals(res2.sort(), [2]);
  const res3 = await new JsonArrTrimCommand([key, "$.a", 1, 1]).exec(client);
  assertEquals(res3, [1]);
  const res4 = await new JsonGetCommand([key, "$.a"]).exec(client);
  assertEquals(res4, [[2]]);
});
