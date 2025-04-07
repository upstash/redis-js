import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireAtCommand } from "./hexpireat";
import { HGetCommand } from "./hget";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("expires a hash key at a specific timestamp with NX option", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();
  const timestamp = Math.floor(Date.now() / 1000) + 2;

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  const res = await new HExpireAtCommand([key, hashKey, timestamp, "NX"]).exec(client);
  expect(res).toEqual([1]);

  await new Promise((res) => setTimeout(res, 3000));
  const res2 = await new HGetCommand([key, hashKey]).exec(client);
  expect(res2).toEqual(null);
});
