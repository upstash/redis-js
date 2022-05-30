import { newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";
import { PublishCommand } from "./publish.ts";

const client = newHttpClient();

Deno.test("returns the number of clients that received the message", async () => {
  const res = await new PublishCommand(["channel", "hello"]).exec(client);

  assertEquals(typeof res, "number");
});
