import { newHttpClient, randomID } from "../test-utils.ts";
import { PingCommand } from "./ping.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

Deno.test(
  "with message",
  async (t) => {
    await t.step(
      "returns the message",
      async () => {
        const message = randomID();
        const res = await new PingCommand(message).exec(client);
        assertEquals(res, message);
      },
    );
  },
);
Deno.test(
  "without message",
  async (t) => {
    await t.step(
      "returns pong",
      async () => {
        const res = await new PingCommand().exec(client);
        assertEquals(res, "PONG");
      },
    );
  },
);
