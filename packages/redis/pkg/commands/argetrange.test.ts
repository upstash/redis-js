import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArGetRangeCommand } from "./argetrange";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARGETRANGE", () => {
  test("returns one element per index with nulls for holes", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "a"]).exec(client);
    await new ArSetCommand([key, 2, "c"]).exec(client);
    expect(await new ArGetRangeCommand([key, 0, 3]).exec(client)).toEqual(["a", null, "c", null]);
  });

  test("reverses the order when start > end", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "a", "b", "c"]).exec(client);
    expect(await new ArGetRangeCommand([key, 2, 0]).exec(client)).toEqual(["c", "b", "a"]);
  });
});
