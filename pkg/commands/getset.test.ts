import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { GetSetCommand } from "./getset.ts";
import { SetCommand } from "./set.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "overwrites the original value",
  async () => {
    const key = newKey();
    const value = Math.random().toString();
    const newValue = Math.random().toString();
    await new SetCommand(key, value).exec(client);
    const res = await new GetSetCommand(key, newValue).exec(client);

    assertEquals(res, value);
    const res2 = await new GetCommand(key).exec(client);

    assertEquals(res2, newValue);
  },
);
it(
  "sets a new value if empty",
  async () => {
    const key = newKey();
    const newValue = Math.random().toString();
    const res = await new GetSetCommand(key, newValue).exec(client);

    assertEquals(res, null);
    const res2 = await new GetCommand(key).exec(client);

    assertEquals(res2, newValue);
  },
);
