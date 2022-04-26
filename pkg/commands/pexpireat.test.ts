import { keygen, newHttpClient } from "../test-utils.ts";
import { GetCommand } from "./get.ts";
import { PExpireAtCommand } from "./pexpireat.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { SetCommand } from "./set.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  it("expires the key", async () => {
    const key = newKey();
    const value = Math.random().toString();
    await new SetCommand(key, value).exec(client);

    const res = await new PExpireAtCommand(key, 1000).exec(client);
    assertEquals(res, 1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand(key).exec(client);
    assertEquals(res2, null);
  });
});
