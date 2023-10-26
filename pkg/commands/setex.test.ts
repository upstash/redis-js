import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { GetCommand } from "./get";
import { SetExCommand } from "./setex";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("sets value", async () => {
  const key = newKey();
  const value = randomID();

  const res = await new SetExCommand([key, 1, value]).exec(client);

  expect(res).toEqual("OK");
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(null);
});
