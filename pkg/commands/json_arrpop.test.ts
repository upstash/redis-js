import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonGetCommand } from "./json_get.ts";
import { JsonArrPopCommand } from "./json_arrpop.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Pop a value from an index and insert a new value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", {
    "max_level": [80, 90, 100, 120],
  }]).exec(client);
  assertEquals(res1, "OK");

  const res2 = await new JsonArrPopCommand([key, "$.max_level", 0]).exec(
    client,
  );
  assertEquals(res2, [80]);

  const res3 = await new JsonGetCommand([key, "$.max_level"]).exec(client);
  assertEquals(res3, [[90, 100, 120]]);
});
