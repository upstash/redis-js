import { newHttpClient } from "../test-utils.ts";
import { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { FlushDBCommand } from "./flushdb.ts";
const client = newHttpClient();

describe(
  "without options",
  () => {
    it(
      "flushes the db",
      async () => {
        const res = await new FlushDBCommand().exec(client);
        assertEquals(res, "OK");
      },
    );
  },
);
describe(
  "async",
  () => {
    it(
      "flushes the db",
      async () => {
        const res = await new FlushDBCommand({ async: true }).exec(client);
        assertEquals(res, "OK");
      },
    );
  },
);
