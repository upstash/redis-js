import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonObjKeysCommand } from "./json_objkeys.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("return the keys", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "a": [3],
    "nested": { "a": { "b": 2, "c": 1 } },
  }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonObjKeysCommand([key, "$..a"]).exec(client);
  for (const e of res2.sort()) {
    if (e === null) continue;
    e.sort();
  }
  assertEquals(res2, [["b", "c"], null]);
});
