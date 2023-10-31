import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SMembersCommand } from "./smembers";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns all members of the set", async () => {
  const key = newKey();
  const value1 = { v: randomID() };
  const value2 = { v: randomID() };

  await new SAddCommand([key, value1, value2]).exec(client);
  const res = await new SMembersCommand<{ v: string }[]>([key]).exec(client);

  expect(res!.length).toBe(2);
  expect(res!.map(({ v }) => v).includes(value1.v));
  expect(res!.map(({ v }) => v).includes(value2.v)).toBe(true);
});
