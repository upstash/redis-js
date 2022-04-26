import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { TypeCommand } from "./type.ts";
import { LPushCommand } from "./lpush.ts";
import { HSetCommand } from "./hset.ts";
import { SAddCommand } from "./sadd.ts";
import { ZAddCommand } from "./zadd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "string",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = Math.random().toString();
        await new SetCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "string");
      },
    );
  },
);

describe(
  "list",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = Math.random().toString();
        await new LPushCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "list");
      },
    );
  },
);

describe(
  "set",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = Math.random().toString();
        await new SAddCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "set");
      },
    );
  },
);

describe(
  "hash",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const field = Math.random().toString();
        const value = Math.random().toString();
        await new HSetCommand(key, { [field]: value }).exec(client);
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "hash");
      },
    );
  },
);

describe(
  "zset",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const member = Math.random().toString();
        await new ZAddCommand(key, { score: 0, member }).exec(client);
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "zset");
      },
    );
  },
);

describe(
  "none",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const res = await new TypeCommand(key).exec(client);
        assertEquals(res, "none");
      },
    );
  },
);
