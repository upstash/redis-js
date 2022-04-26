import { newHttpClient } from "../test-utils";
import { describe, expect, it } from "@jest/globals";
import { ScriptLoadCommand } from "./script_load";
import { randomUUID } from "crypto";
import { ScriptExistsCommand } from "./script_exists";
import { ScriptFlushCommand } from "./script_flush";
const client = newHttpClient();

describe(
  "sync",
  () => {
    it(
      "flushes all scripts",
      async () => {
        const script = `return "${randomUUID()}"`;
        const sha1 = await new ScriptLoadCommand(script).exec(client);
        expect(await new ScriptExistsCommand(sha1).exec(client)).toEqual(1);

        const res = await new ScriptFlushCommand({ sync: true }).exec(client);
        expect(res).toEqual("OK");
        expect(await new ScriptExistsCommand(sha1).exec(client)).toEqual(0);
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
        const script = `return "${randomUUID()}"`;
        const sha1 = await new ScriptLoadCommand(script).exec(client);
        expect(await new ScriptExistsCommand(sha1).exec(client)).toEqual(1);

        const res = await new ScriptFlushCommand({ sync: true }).exec(client);

        expect(res).toEqual("OK");

        await new Promise((res) => setTimeout(res, 5000));
        expect(await new ScriptExistsCommand(sha1).exec(client)).toEqual(0);
      },
    );
  },
);
