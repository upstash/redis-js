import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonRespCommand } from "./json_resp";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Return an array of RESP details about a document", async () => {
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
  expect(res1).toBe("OK");
  const res2 = await new JsonRespCommand([key]).exec(client);
  expect(res2.length).toBe(15);
});
