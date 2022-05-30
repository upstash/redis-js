import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SPopCommand } from "./spop.ts";
import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without count", async (t) => {
  await t.step("returns the first element", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SPopCommand([key]).exec(client);
    assertEquals(res, member);
  });
});

Deno.test("with count", async (t) => {
  await t.step("returns the first n elements", async () => {
    const key = newKey();
    const member1 = randomID();
    const member2 = randomID();
    const member3 = randomID();
    const member4 = randomID();
    await new SAddCommand([key, member1, member2, member3, member4]).exec(
      client,
    );
    const res = await new SPopCommand<string[]>([key, 2]).exec(client);

    assertEquals(res?.length, 2);
    assertEquals([member1, member2, member3, member4].includes(res![0]), true);
    assertEquals([member1, member2, member3, member4].includes(res![1]), true);
  });
});
