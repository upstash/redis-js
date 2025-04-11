import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireCommand } from "./hexpire";
import { HTtlCommand } from "./httl";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("retrieves the TTL of a hash key", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  await new HExpireCommand([key, hashKey, 5]).exec(client);

  const res = await new HTtlCommand([key, hashKey]).exec(client);
  expect(res[0]).toBeGreaterThan(0);
});
