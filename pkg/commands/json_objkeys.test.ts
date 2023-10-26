import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonObjKeysCommand } from "./json_objkeys";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("return the keys", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: [3],
      nested: { a: { b: 2, c: 1 } },
    },
  ]).exec(client);
  expect(res1).toEqual("OK");
  const res2 = await new JsonObjKeysCommand([key, "$..a"]).exec(client);
  for (const e of res2.sort()) {
    if (e === null) {
      continue;
    }
    e.sort();
  }
  expect(res2).toEqual([["b", "c"], null]);
});
