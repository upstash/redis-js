import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { SetCommand } from "./set.ts";
import { RenameCommand } from "./rename.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("renames the key", async () => {
  const source = newKey();
  const destination = newKey();
  const value = crypto.randomUUID();
  await new SetCommand(source, value).exec(client);
  const res = await new RenameCommand(source, destination).exec(client);
  assertEquals(res, "OK");
});
