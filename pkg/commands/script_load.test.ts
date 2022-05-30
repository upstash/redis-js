import { newHttpClient } from "../test-utils.ts";
import { ScriptLoadCommand } from "./script_load.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";
const client = newHttpClient();

Deno.test("returns the hash", async () => {
  const script = "return ARGV[1]";
  const res = await new ScriptLoadCommand([script]).exec(client);
  assertEquals(res, "098e0f0d1448c0a81dafe820f66d460eb09263da");
});
