import { newHttpClient, randomID } from "../test-utils.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { ScriptExistsCommand } from "./script_exists.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

Deno.test("with a single script", async (t) => {
  await t.step("when the script exists", async (t) => {
    await t.step("returns 1", async () => {
      const script = `return "${randomID()}"`;
      const hash = await new ScriptLoadCommand([script]).exec(client);
      const res = await new ScriptExistsCommand([hash]).exec(client);
      assertEquals(res, [1]);
    });
  });
  await t.step("when the script does not exist", async (t) => {
    await t.step("returns 0", async () => {
      const res = await new ScriptExistsCommand(["21"]).exec(client);
      assertEquals(res, [0]);
    });
  });
});
Deno.test("with multiple scripts", async (t) => {
  await t.step("returns the found scripts", async () => {
    const script1 = `return "${randomID()}"`;
    const script2 = `return "${randomID()}"`;
    const hash1 = await new ScriptLoadCommand([script1]).exec(client);
    const hash2 = await new ScriptLoadCommand([script2]).exec(client);
    const res = await new ScriptExistsCommand([hash1, hash2]).exec(client);
    assertEquals(res, [1, 1]);
  });
});
