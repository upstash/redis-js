import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArLastItemsCommand } from "./arlastitems";
import { ArRingCommand } from "./arring";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARRING / ARLASTITEMS", () => {
  test("builds the commands", () => {
    expect(new ArRingCommand(["k", 3, "a"]).command).toEqual(["ARRING", "k", 3, "a"]);
    expect(new ArLastItemsCommand(["k", 2, { rev: true }]).command).toEqual([
      "ARLASTITEMS",
      "k",
      2,
      "REV",
    ]);
  });

  test("keeps the newest values and wraps", async () => {
    const key = newKey();
    expect(await new ArRingCommand([key, 3, "a", "b", "c"]).exec(client)).toBe(2);
    expect(await new ArRingCommand([key, 3, "d"]).exec(client)).toBe(0);

    expect(await new ArLastItemsCommand([key, 3]).exec(client)).toEqual(["b", "c", "d"]);
    expect(await new ArLastItemsCommand([key, 3, { rev: true }]).exec(client)).toEqual([
      "d",
      "c",
      "b",
    ]);
  });
});
