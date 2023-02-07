import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { JsonGetCommand } from "./json_get.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonClearCommand } from "./json_clear.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Clear container values and set numeric values to 0", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    '{"obj":{"a":1, "b":2}, "arr":[1,2,3], "str": "foo", "bool": true, "int": 42, "float": 3.14}',
  ]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonClearCommand([key, "$.*"]).exec(client);
  assertEquals(res2, 4);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res3, [{
    obj: {},
    arr: [],
    str: "foo",
    bool: true,
    int: 0,
    float: 0,
  }]);
});
