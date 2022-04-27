import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { DelCommand } from "./del.ts";
import { SetCommand } from "./set.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "when key does not exist",
  () => {
    it(
      "does nothing",
      async () => {
        const key = newKey();

        const res = await new DelCommand(key).exec(client);
        assertEquals(res, 0);
      },
    );
  },
);
describe(
  "when key does exist",
  () => {
    it(
      "deletes the key",
      async () => {
        const key = newKey();
        await new SetCommand(key, "value").exec(client);
        const res = await new DelCommand(key).exec(client);
        assertEquals(res, 1);
      },
    );
  },
);
describe(
  "with multiple keys",
  () => {
    describe(
      "when one does not exist",
      () => {
        it(
          "deletes all keys",
          async () => {
            const key1 = newKey();
            const key2 = newKey();
            await new SetCommand(key1, "value").exec(client);
            const res = await new DelCommand(key1, key2).exec(client);
            assertEquals(res, 1);
          },
        );
      },
    );
  },
);
