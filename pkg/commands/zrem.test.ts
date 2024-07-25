import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZRemCommand } from "./zrem";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of removed members", async () => {
  const key = newKey();
  const member1 = randomID();
  const member2 = randomID();
  await new ZAddCommand([key, { score: 1, member: member1 }, { score: 2, member: member2 }]).exec(
    client
  );
  const res = await new ZRemCommand([key, member1, member2]).exec(client);
  expect(res).toEqual(2);
});
