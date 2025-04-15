import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HPExpireCommand } from "./hpexpire";
import { HPTtlCommand } from "./hpttl";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("retrieves the TTL of a hash key in milliseconds", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  await new HPExpireCommand([key, hashKey, 5000]).exec(client);

  const res = await new HPTtlCommand([key, hashKey]).exec(client);
  expect(res[0]).toBeGreaterThan(0);
});
