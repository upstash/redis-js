import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { SetBitCommand } from "./setbit";

import { GetBitCommand } from "./getbit";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the bit at offset", async () => {
  const key = newKey();

  await new SetBitCommand([key, 0, 1]).exec(client);
  const res = await new GetBitCommand([key, 0]).exec(client);
  expect(res).toEqual(1);
});
