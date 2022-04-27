import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { PExpireCommand } from "./pexpire.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "without options",
  () => {
    it(
      "expires a key correctly",
      async () => {
        const key = newKey();
        const value = crypto.randomUUID();
        await new SetCommand(key, value).exec(client);
        const res = await new PExpireCommand(key, 1000).exec(client);
        assertEquals(res, 1);
        await new Promise((res) => setTimeout(res, 2000));
        const res2 = await new GetCommand(key).exec(client);

        assertEquals(res2, null);
      },
    );
  },
);
