import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArInfoCommand, deserializeArInfoResponse } from "./arinfo";
import { ArGetCommand } from "./arget";
import { ArGrepCommand } from "./argrep";
import { ArLenCommand } from "./arlen";
import { ArNextCommand } from "./arnext";
import { ArScanCommand } from "./arscan";
import { ArSeekCommand } from "./arseek";
import { ArSetCommand } from "./arset";
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

  test("keeps integers outside the safe range as strings", () => {
    expect<Record<string, unknown>>(
      deserializeArInfoResponse(["len", "18446744073709551614", "count", 1])
    ).toEqual({ len: "18446744073709551614", count: 1 });
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

describe("indexes beyond Number.MAX_SAFE_INTEGER", () => {
  // The highest usable index is 2^64 - 2; the server returns anything above the safe
  // integer range as a string, and the SDK preserves it instead of rounding.
  const highIndex = "18446744073709551613";

  test("preserves large indexes in reads, scans and greps", async () => {
    const key = newKey();
    expect(await new ArSetCommand([key, highIndex, "x"]).exec(client)).toBe(1);

    expect(await new ArLenCommand([key]).exec(client)).toBe("18446744073709551614");
    expect(await new ArGetCommand([key, highIndex]).exec(client)).toBe("x");
    expect(await new ArScanCommand([key, 0, "18446744073709551614"]).exec(client)).toEqual([
      [highIndex, "x"],
    ]);
    expect(
      await new ArGrepCommand([
        key,
        "-",
        "+",
        { predicates: [{ exact: "x" }], withValues: true },
      ]).exec(client)
    ).toEqual([[highIndex, "x"]]);
  });

  test("preserves large indexes from the append cursor and arinfo", async () => {
    const key = newKey();
    await new ArSetCommand([key, highIndex, "x"]).exec(client);

    expect(await new ArSeekCommand([key, highIndex]).exec(client)).toBe(1);
    expect(await new ArNextCommand([key]).exec(client)).toBe(highIndex);
    expect(await new ArInsertCommand([key, "y"]).exec(client)).toBe(highIndex);

    const info = await new ArInfoCommand([key]).exec(client);
    expect(info.len).toBe("18446744073709551614");
  });
});
