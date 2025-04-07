import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireCommand } from "./hexpire";
import { HExpireTimeCommand } from "./hexpiretime";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("retrieves the expiration time of a hash key", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  await new HExpireCommand([key, hashKey, 5]).exec(client);

  const res = await new HExpireTimeCommand([key, hashKey]).exec(client);
  expect(res[0]).toBeGreaterThan(Math.floor(Date.now() / 1000));
});
