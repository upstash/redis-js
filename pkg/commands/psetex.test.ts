import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { GetCommand } from "./get";
import { PSetEXCommand } from "./psetex";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("sets value", async () => {
  const key = newKey();
  const value = randomID();

  const res = await new PSetEXCommand([key, 1000, value]).exec(client);

  expect(res).toEqual("OK");
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand([key]).exec(client);

  expect(res2).toEqual(null);
});
