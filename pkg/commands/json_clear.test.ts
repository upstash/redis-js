import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonGetCommand } from "./json_get";
import { JsonSetCommand } from "./json_set";

import { JsonClearCommand } from "./json_clear";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Clear container values and set numeric values to 0", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    '{"obj":{"a":1, "b":2}, "arr":[1,2,3], "str": "foo", "bool": true, "int": 42, "float": 3.14}',
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonClearCommand([key, "$.*"]).exec(client);
  expect(res2).toEqual(4);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res3).toEqual([
    {
      obj: {},
      arr: [],
      str: "foo",
      bool: true,
      int: 0,
      float: 0,
    },
  ]);
});
