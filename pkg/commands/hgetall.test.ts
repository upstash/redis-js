import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HGetAllCommand } from "./hgetall.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
it(
  "returns all fields",
  async () => {
    const key = newKey();
    const field2 = Math.random().toString();
    const field1 = Math.random().toString();
    const value1 = false;
    const value2 = Math.random().toString();
    await new HSetCommand(key, { [field1]: value1, [field2]: value2 }).exec(
      client,
    );

    const res = await new HGetAllCommand(key).exec(client);

    const obj = { [field1]: value1, [field2]: value2 };
    assertEquals(res, obj);
  },
);
describe(
  "when hash does not exist",
  () => {
    it(
      "it returns null",
      async () => {
        const res = await new HGetAllCommand(Math.random().toString()).exec(
          client,
        );
        assertEquals(res, null);
      },
    );
  },
);
