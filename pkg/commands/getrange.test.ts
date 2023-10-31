import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { GetRangeCommand } from "./getrange";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets an exiting value", async () => {
  const key = newKey();
  const value = "Hello World";
  await new SetCommand([key, value]).exec(client);
  const res = await new GetRangeCommand([key, 2, 4]).exec(client);

  expect(res).toEqual(value.slice(2, 5));
});

test("gets a non-existing value", async () => {
  const key = newKey();
  const res = await new GetRangeCommand([key, 10, 24]).exec(client);

  expect(res).toEqual("");
});
