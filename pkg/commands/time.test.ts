import { newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";
import { TimeCommand } from "./time.ts";
const client = newHttpClient();

Deno.test(
  "returns the time",
  async () => {
    const res = await new TimeCommand().exec(client);

    assertEquals(typeof res[0], "number");
    assertEquals(typeof res[1], "number");
  },
);
