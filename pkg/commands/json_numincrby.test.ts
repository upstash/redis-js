import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonNumIncrByCommand } from "./json_numincrby";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: "b",
      b: [{ a: 2 }, { a: 5 }, { a: "c" }],
    },
  ]).exec(client);
  expect(res1).toEqual("OK");
  const res2 = await new JsonNumIncrByCommand([key, "$.a", 2]).exec(client);
  expect(res2.sort()).toEqual([null]);
  const res3 = await new JsonNumIncrByCommand([key, "$..a", 2]).exec(client);
  expect(res3.sort()).toEqual([4, 7, null, null]);
});
