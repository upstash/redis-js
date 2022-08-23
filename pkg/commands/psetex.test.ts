import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { PSetEXCommand } from "./psetex.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("sets value", async () => {
  const key = newKey();
  const value = randomID();

  const res = await new PSetEXCommand([key, 1000, value]).exec(client);

  assertEquals(res, "OK");
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  assertEquals(res2, null);
});
