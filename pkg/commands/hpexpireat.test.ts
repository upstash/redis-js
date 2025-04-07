import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HPExpireAtCommand } from "./hpexpireat";
import { HGetCommand } from "./hget";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("expires a hash key at a specific timestamp in milliseconds", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();
  const timestamp = Date.now() + 2000;

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  const res = await new HPExpireAtCommand([key, hashKey, timestamp]).exec(client);
  expect(res).toEqual([1]);

  await new Promise((res) => setTimeout(res, 3000));
  const res2 = await new HGetCommand([key, hashKey]).exec(client);
  expect(res2).toEqual(null);
});
