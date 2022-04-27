import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { SCardCommand } from "./scard.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the cardinality",
  async () => {
    const key = newKey();
    await new SAddCommand(key, "member1").exec(client);
    const res = await new SCardCommand(key).exec(client);
    assertEquals(res, 1);
  },
);
