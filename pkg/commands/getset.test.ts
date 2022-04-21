import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { GetSetCommand } from "./getset";
import { SetCommand } from "./set";
import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("overwrites the original value", async () => {
  const key = newKey()
  const value = randomUUID()
  const newValue = randomUUID()
  await new SetCommand([key, value]).exec(client)
  const res = await new GetSetCommand([key, newValue]).exec(client)

  expect(res).toEqual(value)
  const res2 = await new GetCommand([key]).exec(client)

  expect(res2).toEqual(newValue)
})
it("sets a new value if empty", async () => {
  const key = newKey()
  const newValue = randomUUID()
  const res = await new GetSetCommand([key, newValue]).exec(client)

  expect(res).toBeNull()
  const res2 = await new GetCommand([key]).exec(client)

		expect(res2).toEqual(newValue);
	},
);
