import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";
import { HSetNXCommand } from "./hsetnx.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "when hash exists already",
  () => {
    it(
      "returns 0",
      async () => {
        const key = newKey();
        const field = Math.random().toString();
        const value = Math.random().toString();
        const newValue = Math.random().toString();
        await new HSetCommand(key, { [field]: value }).exec(client);
        const res = await new HSetNXCommand(key, field, newValue).exec(client);
        assertEquals(res, 0);
        const res2 = await new HGetCommand(key, field).exec(client);

        assertEquals(res2, value);
      },
    );
  },
);
describe(
  "when hash does not exist",
  () => {
    it(
      "returns 1",
      async () => {
        const key = newKey();
        const field = Math.random().toString();
        const value = Math.random().toString();
        const res = await new HSetNXCommand(key, field, value).exec(client);
        assertEquals(res, 1);
        const res2 = await new HGetCommand(key, field).exec(client);

        assertEquals(res2, value);
      },
    );
  },
);
