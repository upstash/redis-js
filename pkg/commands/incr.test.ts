import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { IncrCommand } from "./incr.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "increments a non-existing value",
  async () => {
    const key = newKey();
    const res = await new IncrCommand(key).exec(client);

    assertEquals(res, 1);
  },
);

Deno.test(
  "increments and existing value",
  async () => {
    const key = newKey();
    await new SetCommand(key, 4).exec(client);
    const res = await new IncrCommand(key).exec(client);

    assertEquals(res, 5);
  },
);
