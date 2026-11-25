import { expect, test } from "bun:test";

import { ZInterStoreCommand } from "./zinterstore";
import { ZUnionCommand } from "./zunion";
import { ZUnionStoreCommand } from "./zunionstore";

test("ZUNION omits an undefined aggregate", () => {
  expect(new ZUnionCommand([1, "key", { aggregate: undefined, withScores: true }]).command).toEqual(
    ["zunion", 1, "key", "withscores"]
  );
});

test("ZUNIONSTORE omits an undefined aggregate", () => {
  expect(new ZUnionStoreCommand(["dest", 1, "key", { aggregate: undefined }]).command).toEqual([
    "zunionstore",
    "dest",
    1,
    "key",
  ]);
});

test("ZINTERSTORE omits an undefined aggregate", () => {
  expect(new ZInterStoreCommand(["dest", 1, "key", { aggregate: undefined }]).command).toEqual([
    "zinterstore",
    "dest",
    1,
    "key",
  ]);
});

test("sorted-set commands preserve an explicit aggregate", () => {
  expect(new ZUnionCommand([1, "key", { aggregate: "max" }]).command).toEqual([
    "zunion",
    1,
    "key",
    "aggregate",
    "max",
  ]);
  expect(new ZUnionStoreCommand(["dest", 1, "key", { aggregate: "max" }]).command).toEqual([
    "zunionstore",
    "dest",
    1,
    "key",
    "aggregate",
    "max",
  ]);
  expect(new ZInterStoreCommand(["dest", 1, "key", { aggregate: "max" }]).command).toEqual([
    "zinterstore",
    "dest",
    1,
    "key",
    "aggregate",
    "max",
  ]);
});
