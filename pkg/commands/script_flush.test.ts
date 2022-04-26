import { newHttpClient } from "../test-utils.ts";
import { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { ScriptExistsCommand } from "./script_exists.ts";
import { ScriptFlushCommand } from "./script_flush.ts";
const client = newHttpClient();

describe(
  "sync",
  () => {
    it(
      "flushes all scripts",
      async () => {
        const script = `return "${Math.random().toString()}"`;
        const sha1 = await new ScriptLoadCommand(script).exec(client);
        assertEquals(await new ScriptExistsCommand(sha1).exec(client), 1);

        const res = await new ScriptFlushCommand({ sync: true }).exec(client);
        assertEquals(res, "OK");
        assertEquals(await new ScriptExistsCommand(sha1).exec(client), 0);
      },
    );
  },
);

describe(
  "async",
  () => {
    it(
      "flushes all scripts",
      async () => {
        const script = `return "${Math.random().toString()}"`;
        const sha1 = await new ScriptLoadCommand(script).exec(client);
        assertEquals(await new ScriptExistsCommand(sha1).exec(client), 1);

        const res = await new ScriptFlushCommand({ sync: true }).exec(client);

        assertEquals(res, "OK");

        await new Promise((res) => setTimeout(res, 5000));
        assertEquals(await new ScriptExistsCommand(sha1).exec(client), 0);
      },
    );
  },
);
