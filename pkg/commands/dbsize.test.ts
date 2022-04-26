import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { DBSizeCommand } from "./dbsize.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the db size",
  async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new SetCommand(key, value).exec(client);
    const res = await new DBSizeCommand().exec(client);
    assertEquals(res > 0, true);
  },
);
