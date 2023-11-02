import { newHttpClient, randomID, keygen } from "../test-utils.ts";

import { afterEach, describe, expect, test } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";
import { PfMergeCommand } from "./pfmerge.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("adding multiple elements at once", () => {
  const key = newKey();
  test("returns 1 if successful, returns 3 as the cardinality", async () => {
    const value1 = randomID();
    const value2 = randomID();
    const value3 = randomID();

    const res = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(res).toBe(1);

    const res2 = await new PfCountCommand([key]).exec(client);

    expect(res2).toBe(3);
  });
});

describe("inserting the same element multiple times", () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  test("modified succesfully and returned correct cardinality for repeated elements", async () => {
    const resInsert = await new PfAddCommand([
      key,
      value1,
      value1,
      value2,
      value2,
    ]).exec(client);
    expect(resInsert).toBe(1);

    const resCount = await new PfCountCommand([key]).exec(client);
    expect(resCount).toBe(2);
  });
});

describe("adding the same strings on different lines doesn't modify the HLL", () => {
  const key = newKey();

  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();

  test("modifies the HLL on the first insertion of strings", async () => {
    const resAdd = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(resAdd).toBe(1);

    const resAddDuplicate = await new PfAddCommand([
      key,
      value1,
      value2,
      value3,
    ]).exec(client);
    expect(resAddDuplicate).toBe(0);
  });
});

describe("merge HLLs with overlapping values and count", () => {
  const key1 = newKey();
  const key2 = newKey();
  const mergedKey = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();

  test("insert overlapping strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2, value3]).exec(client);
    const resAdd = await new PfAddCommand([key2, value3, value4]).exec(client);
    expect(resAdd).toBe(1);

    const resMerge = await new PfMergeCommand([mergedKey, key1, key2]).exec(
      client
    );
    expect(resMerge).toBe("OK");

    const resCount = await new PfCountCommand([mergedKey]).exec(client);
    expect(resCount).toBe(4);
  });
});
