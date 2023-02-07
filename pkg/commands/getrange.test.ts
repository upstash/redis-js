import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { GetRangeCommand } from "./getrange.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("gets an exiting value", async () => {
  const key = newKey();
  const value = "Hello World";
  await new SetCommand([key, value]).exec(client);
  const res = await new GetRangeCommand([key, 2, 4]).exec(client);

  assertEquals(res, value.slice(2, 5));
});

Deno.test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new GetRangeCommand([key, 10, 24]).exec(client);

  assertEquals(res, "");
});
