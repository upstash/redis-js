import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
import { ScriptLoadCommand } from "./script_load";
import { EvalshaCommand } from "./evalsha";
const client = newHttpClient();

const { cleanup } = keygen();
afterAll(cleanup);

describe(
  "without keys",
  () => {
    it(
      "returns something",
      async () => {
        const value = randomUUID();
        const sha1 = await new ScriptLoadCommand(`return {ARGV[1], "${value}"}`)
          .exec(
            client,
          );
        const res = await new EvalshaCommand(sha1, [], [value]).exec(client);
        expect(res).toEqual([value, value]);
      },
    );
  },
);
