import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { SetCommand } from "./set.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { PersistCommand } from "./persist.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test(
  "persists the key",
  async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand(key, value, { ex: 2 }).exec(client);
    const res = await new PersistCommand(key).exec(client);
    assertEquals(res, 1);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res2 = await new GetCommand(key).exec(client);

    assertEquals(res2, value);
  },
);
