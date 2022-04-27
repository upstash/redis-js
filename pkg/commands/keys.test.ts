import { keygen, newHttpClient } from "../test-utils.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { KeysCommand } from "./keys.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "when keys are found",
  () => {
    it(
      "returns keys",
      async () => {
        const key = newKey();
        await new SetCommand(key, "value").exec(client);
        const res = await new KeysCommand(key).exec(client);
        assertEquals(res, [key]);
      },
    );
  },
);
