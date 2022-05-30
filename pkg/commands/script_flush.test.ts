import { newHttpClient, randomID } from "../test-utils.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { ScriptExistsCommand } from "./script_exists.ts";
import { ScriptFlushCommand } from "./script_flush.ts";
const client = newHttpClient();

Deno.test("sync", async (t) => {
  await t.step("flushes all scripts", async () => {
    const script = `return "${randomID()}"`;
    const sha1 = await new ScriptLoadCommand([script]).exec(client);
    assertEquals(await new ScriptExistsCommand([sha1]).exec(client), [1]);

    const res = await new ScriptFlushCommand([{ sync: true }]).exec(client);
    assertEquals(res, "OK");
    assertEquals(await new ScriptExistsCommand([sha1]).exec(client), [0]);
  });
});

Deno.test("async", async (t) => {
  await t.step("flushes all scripts", async () => {
    const script = `return "${randomID()}"`;
    const sha1 = await new ScriptLoadCommand([script]).exec(client);
    assertEquals(await new ScriptExistsCommand([sha1]).exec(client), [1]);

    const res = await new ScriptFlushCommand([{ sync: true }]).exec(client);

    assertEquals(res, "OK");

    await new Promise((res) => setTimeout(res, 5000));
    assertEquals(await new ScriptExistsCommand([sha1]).exec(client), [0]);
  });
});
