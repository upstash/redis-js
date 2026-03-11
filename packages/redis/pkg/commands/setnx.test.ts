import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { GetCommand } from "./get";
import { SetCommand } from "./set";
import { SetNxCommand } from "./setnx";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("sets value", async () => {
  const key = newKey();
  const value = randomID();
  const newValue = randomID();

  const res = await new SetCommand([key, value]).exec(client);

  expect(res).toEqual("OK");
  const res2 = await new SetNxCommand([key, newValue]).exec(client);

  expect(res2).toEqual(0);
  const res3 = await new GetCommand([key]).exec(client);

  expect(res3).toEqual(value);
});
