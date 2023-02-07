import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SMembersCommand } from "./smembers.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("returns all members of the set", async () => {
  const key = newKey();
  const value1 = { v: randomID() };
  const value2 = { v: randomID() };

  await new SAddCommand([key, value1, value2]).exec(client);
  const res = await new SMembersCommand<{ v: string }[]>([key]).exec(client);

  assertEquals(res!.length, 2);
  assertEquals(res!.map(({ v }) => v).includes(value1.v), true);
  assertEquals(res!.map(({ v }) => v).includes(value2.v), true);
});
