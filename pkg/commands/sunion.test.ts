import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SUnionCommand } from "./sunion";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the union", async () => {
  const key1 = newKey();
  const key2 = newKey();

  const member1 = randomID();
  const member2 = randomID();

  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SUnionCommand([key1, key2]).exec(client);
  expect(res.sort()).toEqual([member1, member2].sort());
});
