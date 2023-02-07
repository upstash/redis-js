import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { JsonToggleCommand } from "./json_toggle.ts";
import { JsonGetCommand } from "./json_get.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("Toogle a Boolean value stored at path", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { "bool": true }]).exec(
    client,
  );
  assertEquals(res1, "OK");
  const res2 = await new JsonToggleCommand([key, "$.bool"]).exec(client);
  assertEquals(res2, [0]);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res3, [{ "bool": false }]);
  const res4 = await new JsonToggleCommand([key, "$.bool"]).exec(client);
  assertEquals(res4, [1]);
  const res5 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res5, [{ "bool": true }]);
});
