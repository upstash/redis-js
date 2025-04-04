import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { JsonSetCommand } from "./json_set";
import { JsonGetCommand } from "./json_get";
import { JsonMergeCommand } from "./json_merge";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("JSON.MERGE", () => {
  describe("with object values", () => {
    test("Create a non-existent path-value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
      const mergeResult = await new JsonMergeCommand([key, "$.b", 8]).exec(client);
      expect(mergeResult).toEqual("OK");
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(res).toEqual([{ a: 2, b: 8 }]);
    });

    test("Replace an existing value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
      await new JsonMergeCommand([key, "$.a", 3]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(res).toEqual([{ a: 3 }]);
    });

    test("Delete an existing value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { a: 2 }]).exec(client);
      await new JsonMergeCommand([key, "$", { a: null }]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(res).toEqual([{}]);
    });

    test("Replace an Array", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { a: [2, 4, 6, 8] }]).exec(client);
      await new JsonMergeCommand([key, "$.a", [10, 12]]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(res).toEqual([{ a: [10, 12] }]);
    });

    test("Merge changes in multi-paths", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { f1: { a: 1 }, f2: { a: 2 } }]).exec(client);
      await new JsonMergeCommand([key, "$", { f1: null, f2: { a: 3, b: 4 }, f3: [2, 4, 6] }]).exec(
        client
      );
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(typeof res).toEqual("object");
      expect(res).toEqual([{ f2: { a: 3, b: 4 }, f3: [2, 4, 6] }]);
    });
  });

  describe("with string values", () => {
    test("Create a non-existent path-value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", '{ "a": 2 }']).exec(client);
      await new JsonMergeCommand([key, "$.b", "8"]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(typeof res).toEqual("object");
      expect(res).toEqual([{ a: 2, b: 8 }]);
    });

    test("Replace an existing value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", '{ "a": 2 }']).exec(client);
      await new JsonMergeCommand([key, "$.a", "3"]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(typeof res).toEqual("object");
      expect(res).toEqual([{ a: 3 }]);
    });

    test("Delete an existing value", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", '{ "a": 2 }']).exec(client);
      await new JsonMergeCommand([key, "$", { a: null }]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(typeof res).toEqual("object");
      expect(res).toEqual([{}]);
    });

    test("Replace an Array", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { a: "[2, 4, 6, 8]" }]).exec(client);
      await new JsonMergeCommand([key, "$.a", "[10, 12]"]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(typeof res).toEqual("object");
      expect(res).toEqual([{ a: [10, 12] }]);
    });

    test("Merge changes in multi-paths", async () => {
      const key = newKey();
      await new JsonSetCommand([key, "$", { f1: { a: 1 }, f2: { a: 2 } }]).exec(client);
      await new JsonMergeCommand([
        key,
        "$",
        '{ "f1": null, "f2": { "a": 3, "b": 4 }, "f3": [2, 4, 6] }',
      ]).exec(client);
      const res = await new JsonGetCommand([key, "$"]).exec(client);
      expect(res).toEqual([{ f2: { a: 3, b: 4 }, f3: [2, 4, 6] }]);
    });
  });
});
