import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { RenameNXCommand } from "./renamenx.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("when the key exists", async (t) => {
  await t.step("does nothing", async () => {
    const source = newKey();
    const destination = newKey();
    const sourceValue = crypto.randomUUID();
    const destinationValue = crypto.randomUUID();
    await new SetCommand(source, sourceValue).exec(client);
    await new SetCommand(destination, destinationValue).exec(client);
    const res = await new RenameNXCommand(source, destination).exec(client);
    assertEquals(res, 0);
  });
});
Deno.test("when the key does not exist", async (t) => {
  await t.step("renames the key", async () => {
    const source = newKey();
    const destination = newKey();
    const value = crypto.randomUUID();
    await new SetCommand(source, value).exec(client);
    const res = await new RenameNXCommand(source, destination).exec(client);
    assertEquals(res, 1);
  });
});
