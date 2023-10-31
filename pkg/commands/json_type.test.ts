import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonTypeCommand } from "./json_type";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("return the length", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      a: 2,
      nested: { a: true },
      foo: "bar",
    },
  ]).exec(client);
  expect(res1).toBe("OK");
  const res2 = await new JsonTypeCommand([key, "$..foo"]).exec(client);
  expect(res2.sort()).toEqual(["string"]);
  const res3 = await new JsonTypeCommand([key, "$..a"]).exec(client);
  expect(res3.sort()).toEqual(["boolean", "integer"]);
});
