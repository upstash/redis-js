import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArGetCommand } from "./arget";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARGET", () => {
  test("returns the stored value", async () => {
    const key = newKey();
    await new ArSetCommand([key, 7, "seven"]).exec(client);
    expect(await new ArGetCommand([key, 7]).exec(client)).toBe("seven");
  });

  test("returns null for a hole and for a missing key", async () => {
    const key = newKey();
    await new ArSetCommand([key, 7, "seven"]).exec(client);
    expect(await new ArGetCommand([key, 3]).exec(client)).toBeNull();
    expect(await new ArGetCommand([newKey(), 0]).exec(client)).toBeNull();
  });
});
