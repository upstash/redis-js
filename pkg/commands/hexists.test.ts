import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HExistsCommand } from "./hexists.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns 1 for an existing field", async () => {
  const key = newKey();
  const field = randomID();
  await new HSetCommand([key, { [field]: randomID() }]).exec(
    client,
  );
  const res = await new HExistsCommand([key, field]).exec(client);
  assertEquals(res, 1);
});
Deno.test("returns 0 if field does not exist", async () => {
  const key = newKey();
  await new HSetCommand([key, {
    [randomID()]: randomID(),
  }]).exec(client);

  const res = await new HExistsCommand([key, "not-existing-field"]).exec(
    client,
  );
  assertEquals(res, 0);
});
Deno.test("returns 0 if hash does not exist", async () => {
  const key = newKey();
  const field = randomID();
  const res = await new HExistsCommand([key, field]).exec(client);
  assertEquals(res, 0);
});
