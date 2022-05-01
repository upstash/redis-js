import { newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { FlushDBCommand } from "./flushdb.ts";
const client = newHttpClient();

Deno.test("without options", async (t) => {
  await t.step("flushes the db", async () => {
    const res = await new FlushDBCommand([]).exec(client);
    assertEquals(res, "OK");
  });
});
Deno.test("async", async (t) => {
  await t.step("flushes the db", async () => {
    const res = await new FlushDBCommand([{ async: true }]).exec(client);
    assertEquals(res, "OK");
  });
});
