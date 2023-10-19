import { keygen, newHttpClient } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SetExCommand } from "./setex";
import { TtlCommand } from "./ttl";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the ttl on a key", async () => {
  const key = newKey();
  const ttl = 60;
  await new SetExCommand([key, ttl, "value"]).exec(client);
  const res = await new TtlCommand([key]).exec(client);
  expect(res).toEqual(ttl);
});
