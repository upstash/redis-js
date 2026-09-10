import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArMGetCommand } from "./armget";
import { ArMSetCommand } from "./armset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARMSET / ARMGET", () => {
  test("builds the command from an object and from tuples", () => {
    expect(new ArMSetCommand(["k", { 0: "a", 10: "b" }]).command).toEqual([
      "ARMSET",
      "k",
      "0",
      "a",
      "10",
      "b",
    ]);
    expect(
      new ArMSetCommand([
        "k",
        [
          [10, "b"],
          [0, "a"],
        ],
      ]).command
    ).toEqual(["ARMSET", "k", 10, "b", 0, "a"]);
    expect(new ArMGetCommand(["k", 0, 10]).command).toEqual(["ARMGET", "k", 0, 10]);
  });

  test("writes scattered slots and reads them back in request order", async () => {
    const key = newKey();
    expect(await new ArMSetCommand([key, { 0: "a", 100: "b" }]).exec(client)).toBe(2);
    expect(await new ArMSetCommand([key, [[100, "B"]]]).exec(client)).toBe(0);
    expect(await new ArMGetCommand([key, 100, 50, 0]).exec(client)).toEqual(["B", null, "a"]);
  });

  test("returns nulls for a missing key", async () => {
    expect(await new ArMGetCommand([newKey(), 0, 1]).exec(client)).toEqual([null, null]);
  });
});
