import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { XAddCommand } from "./xadd.ts";
import { XRangeCommand } from "./xrange.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("should return valid stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const res = await new XAddCommand([key, "*", {
      [field1]: member1,
      [field2]: member2,
    }]).exec(
      client,
    );

    assert(res.length > 0);
  });
});

Deno.test("with NOMKSTREAM", async (t) => {
  await t.step("should return valid stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const first = await new XAddCommand([key, "*", {
      [field1]: member1,
      [field2]: member2,
    }]).exec(
      client,
    );
    assert(first.length > 0);

    const res = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { nomkStream: true },
    ]).exec(client);
    assert(res.length > 0);
  });

  await t.step("should return null", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const res = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { nomkStream: true },
    ]).exec(client);

    assert(res === null);
  });
});

Deno.test("with threshold", async (t) => {
  await t.step("should always return less than or equal to 5", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    for (let i = 0; i < 10; i++) {
      const xaddRes = await new XAddCommand([
        key,
        "*",
        { [field1]: member1, [field2]: member2 },
        { trim: { comparison: "=", threshold: 5, type: "MAXLEN" } },
      ]).exec(client);
      assert(xaddRes.length > 0);

      const xrangeRes = await new XRangeCommand([key, "-", "+"]).exec(client);
      assert(Object.keys(xrangeRes).length <= 5);
    }
  });

  await t.step("should trim the stream by stream id", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    const xaddRes = await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
    ]).exec(client);

    await new XAddCommand([
      key,
      "*",
      { [field1]: member1, [field2]: member2 },
      { trim: { type: "minid", threshold: xaddRes, comparison: "=" } },
    ]).exec(client);

    const xrangeRes = await new XRangeCommand([key, "-", "+"]).exec(client);
    assertEquals(Object.keys(xrangeRes).length, 2);
  });
});
