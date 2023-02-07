import { keygen, newHttpClient } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { ZRemRangeByLexCommand } from "./zremrangebylex.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "returns the number of elements removed",
  async () => {
    const key = newKey();
    await new ZAddCommand([
      key,
      { score: 0, member: "aaaa" },
      { score: 0, member: "b" },
      { score: 0, member: "c" },
      { score: 0, member: "d" },
      { score: 0, member: "e" },
    ]).exec(client);

    const res = await new ZRemRangeByLexCommand([key, "[b", "[e"]).exec(client);
    assertEquals(res, 4);
  },
);
