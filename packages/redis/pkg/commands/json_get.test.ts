import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonGetCommand } from "./json_get";
import { JsonSetCommand } from "./json_set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Return the value at path in JSON serialized form", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: 2,
      b: 3,
      nested: { a: 4, b: null },
    },
  ]).exec(client);
  expect(res1).toBe("OK");
  const res2 = await new JsonGetCommand([key, "$..b"]).exec(client);
  expect(res2).toEqual([null, 3]);
  const res3 = await new JsonGetCommand([key, "$..a", "$..b"]).exec(client);
  expect(res3).toEqual({ "$..b": [null, 3], "$..a": [4, 2] });
});
