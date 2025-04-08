import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireCommand } from "./hexpire";
import { HTtlCommand } from "./httl";
import { HPersistCommand } from "./hpersist";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("persists a hash key correctly", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();
  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  await new HExpireCommand([key, hashKey, 100]).exec(client);
  const res = await new HTtlCommand([key, hashKey]).exec(client);
  expect(res[0]).toBeGreaterThan(0);

  await new HPersistCommand([key, hashKey]).exec(client);
  const res2 = await new HTtlCommand([key, hashKey]).exec(client);
  expect(res2).toEqual([-1]);
});
