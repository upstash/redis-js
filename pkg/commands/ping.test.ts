import { newHttpClient } from "../test-utils.ts";
import { PingCommand } from "./ping.ts";
import { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

describe(
  "with message",
  () => {
    it(
      "returns the message",
      async () => {
        const message = Math.random().toString();
        const res = await new PingCommand(message).exec(client);
        assertEquals(res, message);
      },
    );
  },
);
describe(
  "without message",
  () => {
    it(
      "returns pong",
      async () => {
        const res = await new PingCommand().exec(client);
        assertEquals(res, "PONG");
      },
    );
  },
);
