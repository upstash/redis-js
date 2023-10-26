import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";

import { JsonGetCommand } from "./json_get";
import { JsonToggleCommand } from "./json_toggle";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("Toogle a Boolean value stored at path", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { bool: true }]).exec(client);
  expect(res1, "OK");
  const res2 = await new JsonToggleCommand([key, "$.bool"]).exec(client);
  expect(res2).toEqual([0]);
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res3).toEqual([{ bool: false }]);
  const res4 = await new JsonToggleCommand([key, "$.bool"]).exec(client);
  expect(res4, [1]);
  const res5 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res5, [{ bool: true }]);
});
