import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArOpCommand } from "./arop";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("AROP", () => {
  test("builds the command", () => {
    expect(new ArOpCommand(["k", 0, 9, "sum"]).command).toEqual(["AROP", "k", 0, 9, "SUM"]);
    expect(new ArOpCommand(["k", 0, 9, { match: "x" }]).command).toEqual([
      "AROP",
      "k",
      0,
      9,
      "MATCH",
      "x",
    ]);
  });

  test("aggregates numeric values and skips non-numeric ones", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, 1, 2, "x", 4]).exec(client);

    expect(await new ArOpCommand([key, 0, 3, "SUM"]).exec(client)).toBe(7);
    expect(await new ArOpCommand([key, 0, 3, "MIN"]).exec(client)).toBe(1);
    expect(await new ArOpCommand([key, 0, 3, "MAX"]).exec(client)).toBe(4);
    expect(await new ArOpCommand([key, 0, 3, "USED"]).exec(client)).toBe(4);
    expect(await new ArOpCommand([key, 0, 3, { match: "x" }]).exec(client)).toBe(1);
  });

  test("returns null when there is nothing to aggregate", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "x"]).exec(client);
    expect(await new ArOpCommand([key, 0, 0, "SUM"]).exec(client)).toBeNull();
    expect(await new ArOpCommand([key, 5, 9, "USED"]).exec(client)).toBe(0);
  });
});
