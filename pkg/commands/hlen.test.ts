import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HMSetCommand } from "./hmset.ts";
import { HLenCommand } from "./hlen.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with existing hash", () => {
  it("returns correct number of keys", async () => {
    const key = newKey();
    const field1 = crypto.randomUUID();
    const field2 = crypto.randomUUID();

    const kv: Record<string, string> = {};
    kv[field1] = crypto.randomUUID();
    kv[field2] = crypto.randomUUID();
    await new HMSetCommand(key, kv).exec(client);
    const res = await new HLenCommand(key).exec(client);
    assertEquals(res, 2);
  });
});
