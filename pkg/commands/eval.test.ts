import { EvalCommand } from "./eval.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without keys", async (t) => {
  await t.step("returns something", async () => {
    const value = randomID();
    const res = await new EvalCommand(["return ARGV[1]", [], [value]]).exec(
      client,
    );
    assertEquals(res, value);
  });
});

Deno.test("with keys", async (t) => {
  await t.step("returns something", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    const res = await new EvalCommand([
      `return redis.call("GET", KEYS[1])`,
      [key],
      [],
    ]).exec(client);
    assertEquals(res, value);
  });
});
