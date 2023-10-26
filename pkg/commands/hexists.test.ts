import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HExistsCommand } from "./hexists";
import { HSetCommand } from "./hset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns 1 for an existing field", async () => {
  const key = newKey();
  const field = randomID();
  await new HSetCommand([key, { [field]: randomID() }]).exec(client);
  const res = await new HExistsCommand([key, field]).exec(client);
  expect(res).toEqual(1);
});
test("returns 0 if field does not exist", async () => {
  const key = newKey();
  await new HSetCommand([
    key,
    {
      [randomID()]: randomID(),
    },
  ]).exec(client);

  const res = await new HExistsCommand([key, "not-existing-field"]).exec(client);
  expect(res).toEqual(0);
});
test("returns 0 if hash does not exist", async () => {
  const key = newKey();
  const field = randomID();
  const res = await new HExistsCommand([key, field]).exec(client);
  expect(res).toEqual(0);
});
