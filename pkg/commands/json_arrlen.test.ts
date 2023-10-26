import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonArrLenCommand } from "./json_arrlen";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Get lengths of JSON arrays in a document", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      name: "Wireless earbuds",
      description: "Wireless Bluetooth in-ear headphones",
      connection: { wireless: true, type: "Bluetooth" },
      price: 64.99,
      stock: 17,
      colors: ["black", "white"],
      max_level: [80, 100, 120],
    },
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonArrLenCommand([key, "$.max_level"]).exec(client);
  expect(res2).toEqual([3]);
});
