import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { ZScoreCommand } from "./zscore.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns the score", async () => {
  const key = newKey();
  const member = randomID();
  const score = Math.floor(Math.random() * 10);
  await new ZAddCommand([key, { score, member }]).exec(client);
  const res = await new ZScoreCommand([key, member]).exec(client);
  assertEquals(res, score);
});
