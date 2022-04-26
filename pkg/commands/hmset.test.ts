import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HMSetCommand } from "./hmset.ts";
import { HMGetCommand } from "./hmget.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets exiting values",
  async () => {
    const key = newKey();
    const kv = {
      [Math.random().toString()]: Math.random().toString(),
      [Math.random().toString()]: Math.random().toString(),
    };
    const res = await new HMSetCommand(key, kv).exec(client);

    assertEquals(res, "OK");
    const res2 = await new HMGetCommand(key, ...Object.keys(kv)).exec(client);

    assertEquals(res2, kv);
  },
);
