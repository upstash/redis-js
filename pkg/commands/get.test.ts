import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets an exiting value",
  async () => {
    const key = newKey();
    const value = Math.random().toString();
    await new SetCommand(key, value).exec(client);
    const res = await new GetCommand(key).exec(client);

    assertEquals(res, value);
  },
);

it(
  "gets a non-existing value",
  async () => {
    const key = newKey();
    const res = await new GetCommand(key).exec(client);

    assertEquals(res, null);
  },
);

it(
  "gets an object",
  async () => {
    const key = newKey();
    const value = { v: Math.random().toString() };
    await new SetCommand(key, value).exec(client);
    const res = await new GetCommand(key).exec(client);

    assertEquals(res, value);
  },
);
