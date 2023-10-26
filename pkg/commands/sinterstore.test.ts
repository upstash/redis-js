import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SInterStoreCommand } from "./sinterstore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("stores the intersection", async () => {
  const key1 = newKey();
  const member1 = randomID();
  const key2 = newKey();
  const member2 = member1;
  const destination = newKey();
  await new SAddCommand([key1, member1]).exec(client);
  await new SAddCommand([key2, member2]).exec(client);
  const res = await new SInterStoreCommand([destination, key1, key2]).exec(client);
  expect(res).toEqual(1);
});
