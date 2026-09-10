import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArGrepCommand } from "./argrep";
import { ArSetCommand } from "./arset";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARGREP", () => {
  test("builds the command", () => {
    const cmd = new ArGrepCommand([
      "k",
      "-",
      "+",
      {
        predicates: [{ exact: "a" }, { match: "b" }, { glob: "c*" }, { re: "^d" }],
        combine: "and",
        noCase: true,
        withValues: true,
        limit: 10,
      },
    ]);
    expect(cmd.command).toEqual([
      "ARGREP",
      "k",
      "-",
      "+",
      "EXACT",
      "a",
      "MATCH",
      "b",
      "GLOB",
      "c*",
      "RE",
      "^d",
      "AND",
      "NOCASE",
      "WITHVALUES",
      "LIMIT",
      10,
    ]);
  });

  test("returns matching indexes", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "error: disk", "ok", "ERROR: net"]).exec(client);

    const indexes: number[] = await new ArGrepCommand([
      key,
      "-",
      "+",
      { predicates: [{ match: "error" }] },
    ]).exec(client);
    expect(indexes).toEqual([0]);

    expect(
      await new ArGrepCommand([
        key,
        0,
        10,
        { predicates: [{ match: "error" }], noCase: true },
      ]).exec(client)
    ).toEqual([0, 2]);
  });

  test("returns index-value pairs with withValues", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "apple", "banana", "avocado"]).exec(client);

    const pairs: [number, string][] = await new ArGrepCommand([
      key,
      "-",
      "+",
      { predicates: [{ glob: "a*" }], withValues: true },
    ]).exec(client);
    expect(pairs).toEqual([
      [0, "apple"],
      [2, "avocado"],
    ]);
  });

  test("combines predicates with AND", async () => {
    const key = newKey();
    await new ArSetCommand([key, 0, "apple", "apricot", "banana"]).exec(client);
    expect(
      await new ArGrepCommand([
        key,
        "-",
        "+",
        { predicates: [{ glob: "a*" }, { match: "cot" }], combine: "AND" },
      ]).exec(client)
    ).toEqual([1]);
  });
});
