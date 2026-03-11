import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonArrPopCommand } from "./json_arrpop";
import { JsonGetCommand } from "./json_get";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Pop a value from an index and insert a new value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      max_level: [80, 90, 100, 120],
    },
  ]).exec(client);
  expect(res1).toBe("OK");

  const res2 = await new JsonArrPopCommand([key, "$.max_level", 0]).exec(client);
  expect(res2).toEqual([80]);

  const res3 = await new JsonGetCommand([key, "$.max_level"]).exec(client);
  expect(res3).toEqual([[90, 100, 120]]);
});
