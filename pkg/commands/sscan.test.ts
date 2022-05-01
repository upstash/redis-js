import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SScanCommand } from "./sscan.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("without options", async (t) => {
  await t.step("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0]).exec(client);

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});

Deno.test("with match", async (t) => {
  await t.step("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0, { match: member }]).exec(
      client,
    );

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0, { count: 1 }]).exec(client);

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});
