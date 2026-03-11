import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SInterCardCommand } from "./sintercard";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the cardinality of the intersection", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const member1 = randomID();
  const member2 = randomID();
  await new SAddCommand([key1, member1, member2]).exec(client);
  await new SAddCommand([key2, member1]).exec(client);
  const res = await new SInterCardCommand([[key1, key2]]).exec(client);
  expect(res).toEqual(1);
});

test("with limit", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const member1 = randomID();
  const member2 = randomID();
  await new SAddCommand([key1, member1, member2]).exec(client);
  await new SAddCommand([key2, member1, member2]).exec(client);
  const res = await new SInterCardCommand([[key1, key2], { limit: 1 }]).exec(client);
  expect(res).toEqual(1);
});
