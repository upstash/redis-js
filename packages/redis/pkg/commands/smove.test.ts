import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SMoveCommand } from "./smove";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("moves the member", async () => {
  const source = newKey();
  const destination = newKey();
  const member = randomID();
  await new SAddCommand([source, member]).exec(client);
  const res = await new SMoveCommand([source, destination, member]).exec(client);
  expect(res).toEqual(1);
});
