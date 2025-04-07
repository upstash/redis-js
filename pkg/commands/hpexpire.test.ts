import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { HPExpireCommand } from "./hpexpire";
import { HGetCommand } from "./hget";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("expires a hash key in milliseconds", async () => {
  const key = newKey();
  const hashKey = newKey();
  const value = randomID();

  await new HSetCommand([key, { [hashKey]: value }]).exec(client);
  const res = await new HPExpireCommand([key, hashKey, 1000, "NX"]).exec(client);
  expect(res).toEqual([1]);

  await new Promise((res) => setTimeout(res, 1500));
  const res2 = await new HGetCommand([key, hashKey]).exec(client);
  expect(res2).toEqual(null);
});
