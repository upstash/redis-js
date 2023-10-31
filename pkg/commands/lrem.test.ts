import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { LPushCommand } from "./lpush";
import { LRemCommand } from "./lrem";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of deleted elements", async () => {
  const key = newKey();
  await new LPushCommand([key, "element"]).exec(client);
  await new LPushCommand([key, "element"]).exec(client);
  await new LPushCommand([key, "something else"]).exec(client);

  const res = await new LRemCommand([key, 2, "element"]).exec(client);
  expect(res).toEqual(2);
});
