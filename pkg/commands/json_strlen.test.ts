import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonStrLenCommand } from "./json_strlen";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: "foo",
      nested: { a: "hello" },
      nested2: { a: 31 },
    },
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonStrLenCommand([key, "$..a"]).exec(client);
  expect(res2.sort(), [3, 5, null]);
});
