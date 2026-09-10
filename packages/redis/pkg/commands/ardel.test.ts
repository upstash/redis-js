import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArCountCommand } from "./arcount";
import { ArDelCommand } from "./ardel";
import { ArDelRangeCommand } from "./ardelrange";
import { ArLenCommand } from "./arlen";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARDEL / ARDELRANGE / ARCOUNT / ARLEN", () => {
  test("builds the commands", () => {
    expect(new ArDelCommand(["k", 1, 2]).command).toEqual(["ARDEL", "k", 1, 2]);
    expect(new ArDelRangeCommand(["k", [0, 5], [10, 20]]).command).toEqual([
      "ARDELRANGE",
      "k",
      0,
      5,
      10,
      20,
    ]);
  });

  test("deleting leaves holes and only counts occupied slots", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "a", "b", "c", "d", "e"]).exec(client);

    expect(await new ArDelCommand([key, 1, 1, 99]).exec(client)).toBe(1);
    expect(await new ArCountCommand([key]).exec(client)).toBe(4);
    expect(await new ArLenCommand([key]).exec(client)).toBe(5);

    expect(await new ArDelRangeCommand([key, [0, 2], [4, 4]]).exec(client)).toBe(3);
    expect(await new ArCountCommand([key]).exec(client)).toBe(1);
  });

  test("sparse arrays: arlen tracks extent, arcount tracks contents", async () => {
    const key = newKey();
    await new ArSetCommand([key, 1000, "x"]).exec(client);
    expect(await new ArLenCommand([key]).exec(client)).toBe(1001);
    expect(await new ArCountCommand([key]).exec(client)).toBe(1);
  });

  test("missing keys count as 0", async () => {
    expect(await new ArCountCommand([newKey()]).exec(client)).toBe(0);
    expect(await new ArLenCommand([newKey()]).exec(client)).toBe(0);
  });
});
