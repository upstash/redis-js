import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SDiffStoreCommand } from "./sdiffstore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the diff", async () => {
  const key1 = newKey();
  const member1 = randomID();
  const key2 = newKey();
  const member2 = randomID();
  const destination = newKey();
  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SDiffStoreCommand([destination, key1, key2]).exec(client);
  expect(res).toEqual(1);
});
