import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonGetCommand } from "./json_get";
import { JsonSetCommand } from "./json_set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("replace an existing value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
  expect(res1).toEqual("OK");
  const res2 = await new JsonSetCommand([key, "$.a", 3]).exec(client);
  expect(res2).toEqual("OK");
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res3).toEqual([{ a: 3 }]);
});

test("add a new value", async () => {
  const key = newKey();
  const res1 = await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
  expect(res1).toEqual("OK");
  const res2 = await new JsonSetCommand([key, "$.b", 8]).exec(client);
  expect(res2).toEqual("OK");
  const res3 = await new JsonGetCommand([key, "$"]).exec(client);
  expect(res3).toEqual([{ a: 2, b: 8 }]);
});

test("update multi-paths", async () => {
  const key = newKey();
  const data = {
    f1: { a: 1 },
    f2: { a: 2 },
  };
  const res1 = await new JsonSetCommand([key, "$", data]).exec(client);
  expect(res1).toEqual("OK");
  const res2 = await new JsonSetCommand([key, "$..a", 3]).exec(client);
  expect(res2).toEqual("OK");
  const res3 = await new JsonGetCommand<any[]>([key, "$"]).exec(client);

  expect(res3).not.toBeNull();
  expect(res3!.length).toEqual(1);
  expect(res3![0]?.f1?.a).toEqual(3);
  expect(res3![0]?.f2?.a).toEqual(3);
});
