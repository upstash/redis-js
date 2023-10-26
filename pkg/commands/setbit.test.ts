import { keygen, newHttpClient } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SetBitCommand } from "./setbit";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the original bit", async () => {
  const key = newKey();
  const res = await new SetBitCommand([key, 0, 1]).exec(client);
  expect(res).toEqual(0);
  const res2 = await new SetBitCommand([key, 0, 1]).exec(client);

  expect(res2).toEqual(1);
});
