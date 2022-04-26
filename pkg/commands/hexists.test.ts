import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HExistsCommand } from "./hexists.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("returns 1 for an existing field", async () => {
  const key = newKey();
  const field = Math.random().toString();
  await new HSetCommand(key, { [field]: Math.random().toString() }).exec(
    client,
  );
  const res = await new HExistsCommand(key, field).exec(client);
  assertEquals(res, 1);
});
it("returns 0 if field does not exist", async () => {
  const key = newKey();
  await new HSetCommand(key, {
    [Math.random().toString()]: Math.random().toString(),
  }).exec(client);

  const res = await new HExistsCommand(key, "not-existing-field").exec(client);
  assertEquals(res, 0);
});
it("returns 0 if hash does not exist", async () => {
  const key = newKey();
  const field = Math.random().toString();
  const res = await new HExistsCommand(key, field).exec(client);
  assertEquals(res, 0);
});
