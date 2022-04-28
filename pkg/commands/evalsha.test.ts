import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { EvalshaCommand } from "./evalsha.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "without keys",
  async (t) => {
    await t.step(
      "returns something",
      async () => {
        const value = crypto.randomUUID();
        const sha1 = await new ScriptLoadCommand(`return {ARGV[1], "${value}"}`)
          .exec(
            client,
          );
        const res = await new EvalshaCommand(sha1, [], [value]).exec(client);
        assertEquals(res, [value, value]);
      },
    );
  },
);
