import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonObjLenCommand } from "./json_objlen.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": [3],
    "nested": { "a": { "b": 2, "c": 1 } },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonObjLenCommand([key, "$..a"]).exec(client);
  assertEquals(res2, [2, null]);
});
