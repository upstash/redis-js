import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { RPushCommand } from "./rpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the length after command", async () => {
  const key = newKey();
  const res = await new RPushCommand([key, randomID()]).exec(client);
  expect(res).toEqual(1);
  const res2 = await new RPushCommand([key, randomID(), randomID()]).exec(client);

  expect(res2).toEqual(3);
});
