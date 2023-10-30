import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { EvalshaCommand } from "./evalsha";
import { ScriptLoadCommand } from "./script_load";

const client = newHttpClient();

const { cleanup } = keygen();
afterAll(cleanup);

describe("without keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const sha1 = await new ScriptLoadCommand([`return {ARGV[1], "${value}"}`]).exec(client);
    console.log({ sha1 });
    const res = await new EvalshaCommand([sha1, [], [value]]).exec(client);
    expect(res).toEqual([value, value]);
  });
});
