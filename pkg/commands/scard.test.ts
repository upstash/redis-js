import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SAddCommand } from "./sadd";

import { SCardCommand } from "./scard";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the cardinality", async () => {
  const key = newKey();
  await new SAddCommand([key, "member1"]).exec(client);
  const res = await new SCardCommand([key]).exec(client);
  expect(res).toEqual(1);
});
