import { newHttpClient } from "../test-utils.ts";

import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { EchoCommand } from "./echo.ts";
const client = newHttpClient();

Deno.test("returns the message", async () => {
  const message = crypto.randomUUID();
  const res = await new EchoCommand(message).exec(client);
  assertEquals(res, message);
});
