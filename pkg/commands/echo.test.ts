import { newHttpClient, randomID } from "../test-utils.ts";

import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { EchoCommand } from "./echo.ts";
const client = newHttpClient();

Deno.test("returns the message", async () => {
  const message = randomID();
  const res = await new EchoCommand([message]).exec(client);
  assertEquals(res, message);
});
