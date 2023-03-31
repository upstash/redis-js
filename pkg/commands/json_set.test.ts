import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { JsonSetCommand } from "./json_set.ts";
import { JsonGetCommand } from "./json_get.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("replace an existing value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonSetCommand([key, "$.a", 3]).exec(client);
  assertEquals(res2, "OK");
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res3, [{ a: 3 }]);
});

Deno.test("add a new value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonSetCommand([key, "$.b", 8]).exec(client);
  assertEquals(res2, "OK");
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  assertEquals(res3, [{ a: 2, b: 8 }]);
});

Deno.test("update multi-paths", async () => {
  const key = newKey();
  const data = {
    f1: { a: 1 },
    f2: { a: 2 },
  };
  const res1 = await new JsonSetCommand([key, "$", data]).exec(client);
  assertEquals(res1, "OK");
  const res2 = await new JsonSetCommand([key, "$..a", 3]).exec(client);
  assertEquals(res2, "OK");
  const res3 = await new JsonGetCommand<any[]>([key, "$"]).exec(client);

  assert(res3 !== null);
  assertEquals(res3.length, 1);
  assertEquals(res3[0]?.f1?.a, 3);
  assertEquals(res3[0]?.f2?.a, 3);
});
