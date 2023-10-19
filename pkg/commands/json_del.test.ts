import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonGetCommand } from "./json_get";
import { JsonSetCommand } from "./json_set";

import { JsonDelCommand } from "./json_del";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Delete a value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: 1,
      nested: { a: 2, b: 3 },
    },
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonDelCommand([key, "$..a"]).exec(client);
  expect(res2).toEqual(2);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res3).toEqual([{ nested: { b: 3 } }]);
});
