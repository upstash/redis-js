import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HExpireAtCommand } from "./hexpireat";
import { HGetCommand } from "./hget";
import { TEST_EXPIRE_OPTIONS } from "./hexpire.test";

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

test("can be defined with options or without", async () => {
  const key = newKey();
  const hashKey = newKey();
  const timestamp = Math.floor(Date.now() / 1000) + 2;

  for (const expireOption of TEST_EXPIRE_OPTIONS) {
    expect(new HExpireAtCommand([key, hashKey, timestamp, expireOption]).command).toEqual([
      "hexpireat",
      key,
      timestamp,
      ...(expireOption ? [expireOption] : []),
      "FIELDS",
      1,
      hashKey,
    ]);
  }
});
