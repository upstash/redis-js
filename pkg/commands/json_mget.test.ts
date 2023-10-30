import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonMGetCommand } from "./json_mget";
import { JsonSetCommand } from "./json_set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Return the values at path from multiple key arguments", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const res1 = await new JsonSetCommand([
    key1,
    "$",
    {
      a: 1,
      b: 2,
      nested: { a: 3 },
      c: null,
    },
  ]).exec(client);
  expect(res1).toBe("OK");

  const res2 = await new JsonSetCommand([
    key2,
    "$",
    {
      a: 4,
      b: 5,
      nested: { a: 6 },
      c: null,
    },
  ]).exec(client);
  expect(res2).toEqual("OK");
  const res3 = await new JsonMGetCommand([[key1, key2], "$..a"]).exec(client);
  expect(res3).toEqual([
    [3, 1],
    [6, 4],
  ]);
});
