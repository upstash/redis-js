import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonArrAppendCommand } from "./json_arrappend";
import { JsonArrTrimCommand } from "./json_arrtrim";
import { JsonGetCommand } from "./json_get";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Trim an array to a specific set of values", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: [1],
    },
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonArrAppendCommand([key, "$.a", 2]).exec(client);
  expect(res2.sort(), [2]);
  const res3 = await new JsonArrTrimCommand([key, "$.a", 1, 1]).exec(client);
  expect(res3).toEqual([1]);
  const res4 = await new JsonGetCommand([key, "$.a"]).exec(client);
  expect(res4, [[2]]);
});
