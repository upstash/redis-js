import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";

import { SMembersCommand } from "./smembers";
import { SUnionStoreCommand } from "./sunionstore";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("writes the union to destination", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const dest = newKey();

  const member1 = randomID();
  const member2 = randomID();

  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SUnionStoreCommand([dest, key1, key2]).exec(client);
  expect(res).toEqual(2);

  const res2 = await new SMembersCommand([dest]).exec(client);

  expect(res2).toBeTruthy();
  expect(res2!.sort()).toEqual([member1, member2].sort());
});
