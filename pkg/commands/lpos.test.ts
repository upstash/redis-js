import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { LPosCommand } from "./lpos.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { RPushCommand } from "./rpush.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("with single element", async (t) => {
  await t.step("returns 1", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new RPushCommand([key, value1, value2]).exec(client);
    const res = await new LPosCommand([key, value2]).exec(client);
    assertEquals(res, 1);
  });
});

Deno.test("with rank", async (t) => {
  await t.step("returns 6", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(
      client,
    );
    const cmd = new LPosCommand([key, "c", { rank: 2 }]);
    assertEquals(cmd.command, ["lpos", key, "c", "rank", "2"]);
    const res = await cmd.exec(client);
    assertEquals(res, 6);
  });
});
Deno.test("with count", async (t) => {
  await t.step("returns 2,6", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(
      client,
    );
    const res = await new LPosCommand<number[]>([key, "c", { count: 2 }]).exec(
      client,
    );
    assertEquals(res, [2, 6]);
  });
});

Deno.test("with maxlen", async (t) => {
  await t.step("returns 2", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(
      client,
    );
    const res = await new LPosCommand<number[]>([key, "c", {
      count: 2,
      maxLen: 4,
    }]).exec(client);
    assertEquals(res, [2]);
  });
});
