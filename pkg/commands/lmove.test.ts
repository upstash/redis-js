import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { LPushCommand } from "./lpush";

import { LLenCommand } from "./llen";
import { LMoveCommand } from "./lmove";
import { LPopCommand } from "./lpop";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("moves the entry from left to left", async () => {
  const source = newKey();
  const destination = newKey();
  const value = randomID();
  await new LPushCommand([source, value]).exec(client);

  const res = await new LMoveCommand([source, destination, "left", "left"]).exec(client);
  expect(res).toEqual(value);

  const elementInSource = await new LPopCommand([source]).exec(client);
  expect(elementInSource, null);

  const elementInDestination = await new LPopCommand([destination]).exec(client);
  expect(elementInDestination, value);
});

test("moves the entry from left to right", async () => {
  const source = newKey();
  const destination = newKey();
  const values = new Array(5).fill(0).map((_) => randomID());

  await new LPushCommand([source, ...values]).exec(client);

  const res = await new LMoveCommand([source, destination, "left", "right"]).exec(client);
  expect(res).toEqual(values.at(-1));

  const elementsInSource = await new LLenCommand([source]).exec(client);
  expect(elementsInSource, values.length - 1);

  const elementInDestination = await new LPopCommand([destination]).exec(client);
  expect(elementInDestination, values.at(-1));
});
