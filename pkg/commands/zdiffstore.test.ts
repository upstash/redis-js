import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { ZRangeCommand } from "./zrange.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { ZAddCommand } from "./zadd.ts";
import { ZDiffStoreCommand } from "./zdiffstore.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("stors the diff", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const out = newKey();

  await new ZAddCommand([key1, { score: 1, member: "one" }, {
    score: 2,
    member: "two",
  }, { score: 3, member: "three" }]).exec(client);
  await new ZAddCommand([key2, { score: 1, member: "one" }, {
    score: 2,
    member: "two",
  }]).exec(client);
  const res = await new ZDiffStoreCommand([out, 2, key1, key2]).exec(client);

  assertEquals(res, 1);

  const zset3 = await new ZRangeCommand([out, 0, -1, { withScores: true }])
    .exec(client);
  assertEquals(zset3[0], "three");
  assertEquals(zset3[1], 3);
});
