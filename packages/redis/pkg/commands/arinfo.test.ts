import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArInfoCommand, deserializeArInfoResponse } from "./arinfo";
import { ArInsertCommand } from "./arinsert";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARINFO", () => {
  test("deserializes a flat array into camelCase fields", () => {
    expect<Record<string, unknown>>(
      deserializeArInfoResponse([
        "len",
        3,
        "count",
        "3",
        "slice-size",
        4096,
        "next-insert-index",
        3,
      ])
    ).toEqual({ len: 3, count: 3, sliceSize: 4096, nextInsertIndex: 3 });
  });

  test("reports len, count and the append cursor", async () => {
    const key = newKey();
    await new ArInsertCommand([key, "a", "b", "c"]).exec(client);

    const info = await new ArInfoCommand([key]).exec(client);
    expect(info.len).toBe(3);
    expect(info.count).toBe(3);
    expect(info.nextInsertIndex).toBe(3);
    expect(info.denseSlices).toBeUndefined();

    const full = await new ArInfoCommand([key, { full: true }]).exec(client);
    expect(typeof full.denseSlices).toBe("number");
  });

  test("throws for a missing key", async () => {
    await expect(new ArInfoCommand([newKey()]).exec(client)).rejects.toThrow();
  });
});
