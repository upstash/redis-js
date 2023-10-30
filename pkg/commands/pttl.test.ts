import { keygen, newHttpClient } from "../test-utils";
import { PTtlCommand } from "./pttl";

import { afterAll, expect, test } from "bun:test";
import { SetExCommand } from "./setex";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the ttl on a key", async () => {
  const key = newKey();
  const ttl = 60;
  await new SetExCommand([key, ttl, "value"]).exec(client);
  const res = await new PTtlCommand([key]).exec(client);
  expect(res <= ttl * 1000).toBe(true);
});
