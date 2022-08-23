import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { SetRangeCommand } from "./setrange.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { GetCommand } from "./get.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("sets value", async () => {
  const key = newKey();
  const value = "originalValue";

  const res = await new SetCommand([key, value]).exec(client);

  assertEquals(res, "OK");
  const res2 = await new SetRangeCommand([key, 4, "helloWorld"]).exec(client);

  assertEquals(res2, 14);
  const res3 = await new GetCommand([key]).exec(client);

  assertEquals(res3, "orighelloWorld");
});
