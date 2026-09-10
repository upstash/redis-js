import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArGetRangeCommand } from "./argetrange";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARSET", () => {
  test("builds the command", () => {
    expect(new ArSetCommand(["k", 3, "a", "b"]).command).toEqual(["ARSET", "k", 3, "a", "b"]);
  });

  test("writes contiguous values and counts only new slots", async () => {
    const key = newKey();
    expect(await new ArSetCommand([key, 0, "a", "b"]).exec(client)).toBe(2);
    expect(await new ArSetCommand([key, 1, "B", "c"]).exec(client)).toBe(1);
    expect(await new ArGetRangeCommand([key, 0, 2]).exec(client)).toEqual(["a", "B", "c"]);
  });

  test("serializes objects", async () => {
    const key = newKey();
    await new ArSetCommand([key, 5, { v: 1 }]).exec(client);
    expect(await new ArGetRangeCommand<{ v: number }>([key, 5, 5]).exec(client)).toEqual([
      { v: 1 },
    ]);
  });
});
