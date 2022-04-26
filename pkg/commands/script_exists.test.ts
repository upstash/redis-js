import { newHttpClient } from "../test-utils.ts";
import { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { ScriptExistsCommand } from "./script_exists.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

describe("with a single script", () => {
  describe("when the script exists", () => {
    it("returns 1", async () => {
      const script = `return "${Math.random().toString()}"`;
      const hash = await new ScriptLoadCommand(script).exec(client);
      const res = await new ScriptExistsCommand(hash).exec(client);
      assertEquals(res, 1);
    });
  });
  describe("when the script does not exist", () => {
    it("returns 0", async () => {
      const res = await new ScriptExistsCommand("21").exec(client);
      assertEquals(res, 0);
    });
  });
});
describe("with multiple scripts", () => {
  it("returns the found scripts", async () => {
    const script1 = `return "${Math.random().toString()}"`;
    const script2 = `return "${Math.random().toString()}"`;
    const hash1 = await new ScriptLoadCommand(script1).exec(client);
    const hash2 = await new ScriptLoadCommand(script2).exec(client);
    const res = await new ScriptExistsCommand(hash1, hash2).exec(client);
    assertEquals(res, [1, 1]);
  });
});
