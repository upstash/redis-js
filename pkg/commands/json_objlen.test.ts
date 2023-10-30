import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonObjLenCommand } from "./json_objlen";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: [3],
      nested: { a: { b: 2, c: 1 } },
    },
  ]).exec(client);
  expect(res1).toBe("OK");
  const res2 = await new JsonObjLenCommand([key, "$..a"]).exec(client);
  expect(res2).toEqual([2, null]);
});
