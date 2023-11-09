import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonArrAppendCommand } from "./json_arrappend";
import { JsonArrIndexCommand } from "./json_arrindex";
import { JsonArrInsertCommand } from "./json_arrinsert";
import { JsonGetCommand } from "./json_get";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Find the specific place of a color in a list of product colors", async () => {
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
  expect(res1).toBe("OK");
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
  const res4 = await new JsonGetCommand([key, "$.colors[*]"]).exec(client);
  expect(res4).toEqual(["black", "silver", "blue"]);

  const res5 = await new JsonArrInsertCommand([key, "$.colors", 2, '"yellow"', '"gold"']).exec(
    client,
  );
  expect(res5).toEqual([5]);
  const res6 = await new JsonGetCommand([key, "$.colors"]).exec(client);
  expect(res6).toEqual([["black", "silver", "yellow", "gold", "blue"]]);

  const res7 = await new JsonArrIndexCommand([key, "$..colors", '"silver"']).exec(client);
  expect(res7).toEqual([1]);
});
