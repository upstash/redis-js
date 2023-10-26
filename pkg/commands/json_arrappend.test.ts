import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonArrAppendCommand } from "./json_arrappend";
import { JsonGetCommand } from "./json_get";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Add a new color to a list of product colors", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([
    key,
    "$",
    {
      name: "Noise-cancelling Bluetooth headphones",
      description: "Wireless Bluetooth headphones with noise-cancelling technology",
      connection: { wireless: true, type: "Bluetooth" },
      price: 99.98,
      stock: 25,
      colors: ["black", "silver"],
    },
  ]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonArrAppendCommand([key, "$.colors", '"blue"']).exec(client);
  expect(res2).toEqual([3]);
  const res3 = await new JsonGetCommand([key]).exec(client);
  expect(res3).toEqual({
    name: "Noise-cancelling Bluetooth headphones",
    description: "Wireless Bluetooth headphones with noise-cancelling technology",
    connection: { wireless: true, type: "Bluetooth" },
    price: 99.98,
    stock: 25,
    colors: ["black", "silver", "blue"],
  });
});
