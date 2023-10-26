import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ExpireCommand } from "./expire";
import { GetCommand } from "./get";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("expires a key correctly", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new ExpireCommand([key, 1]).exec(client);
  expect(res).toEqual(1);
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(null);
});
