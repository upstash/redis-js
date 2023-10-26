import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonGetCommand } from "./json_get";
import { JsonStrAppendCommand } from "./json_strappend";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Add 'baz' to existing string", async () => {
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
  const res2 = await new JsonStrAppendCommand([key, "$..a", '"baz"']).exec(client);
  expect(res2.sort(), [6, 8, null]);
  const res3 = await new JsonGetCommand([key]).exec(client);
  expect(res3).toEqual({
    a: "foobaz",
    nested: { a: "hellobaz" },
    nested2: { a: 31 },
  });
});
