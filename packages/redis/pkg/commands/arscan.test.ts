import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArScanCommand } from "./arscan";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARSCAN", () => {
  test("builds the command", () => {
    expect(new ArScanCommand(["k", 0, 100]).command).toEqual(["ARSCAN", "k", 0, 100]);
    expect(new ArScanCommand(["k", 0, 100, { limit: 5 }]).command).toEqual([
      "ARSCAN",
      "k",
      0,
      100,
      "LIMIT",
      5,
    ]);
  });

  test("returns only occupied slots with their indexes", async () => {
    const key = newKey();
    await new ArSetCommand([key, 10, "a"]).exec(client);
    await new ArSetCommand([key, 1000, "b"]).exec(client);
    await new ArSetCommand([key, 5000, "c"]).exec(client);

    expect(await new ArScanCommand([key, 0, 10_000]).exec(client)).toEqual([
      [10, "a"],
      [1000, "b"],
      [5000, "c"],
    ]);
    expect(await new ArScanCommand([key, 0, 10_000, { limit: 2 }]).exec(client)).toEqual([
      [10, "a"],
      [1000, "b"],
    ]);
  });
});
