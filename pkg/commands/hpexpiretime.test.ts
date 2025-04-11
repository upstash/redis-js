import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HPExpireCommand } from "./hpexpire";
import { HPExpireTimeCommand } from "./hpexpiretime";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("retrieves the expiration time of a hash key in milliseconds", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  await new HPExpireCommand([key, hashKey, 5000]).exec(client);

  const res = await new HPExpireTimeCommand([key, hashKey]).exec(client);
  expect(res[0]).toBeGreaterThan(Date.now());
});
