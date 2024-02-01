import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterEach, describe, expect, test } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";
import { PfMergeCommand } from "./pfmerge.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();

afterEach(cleanup);

describe("merge HLLs with distinct values and count", () => {
  const key1 = newKey();
  const key2 = newKey();
  const mergedKey = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();

  test("insert distinct strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2]).exec(client);
    const resAdd = await new PfAddCommand([key2, value3, value4]).exec(client);
    expect(resAdd).toBe(1);

    const resMerge = await new PfMergeCommand([mergedKey, key1, key2]).exec(client);
    expect(resMerge).toBe("OK");

    const resCount = await new PfCountCommand([mergedKey]).exec(client);
    expect(resCount).toBe(4);
  });
});

describe("merge HLL with an empty HLL", () => {
  const key = newKey();
  const emptyKey = newKey();
  const mergedKey = newKey();
  const value1 = randomID();

  test("insert a string into an HLL and keep another HLL empty", async () => {
    const resAdd = await new PfAddCommand([key, value1]).exec(client);
    expect(resAdd).toBe(1);

    const resMerge = await new PfMergeCommand([mergedKey, key, emptyKey]).exec(client);
    expect(resMerge).toBe("OK");

    const resCount = await new PfCountCommand([mergedKey]).exec(client);
    expect(resCount).toBe(1);
  });
});

describe("merge two empty HLLs", () => {
  const emptyKey1 = newKey();
  const emptyKey2 = newKey();
  const mergedKey = newKey();

  test("merge two empty HLLs", async () => {
    const resMerge = await new PfMergeCommand([mergedKey, emptyKey1, emptyKey2]).exec(client);
    expect(resMerge).toBe("OK");

    const resCount = await new PfCountCommand([mergedKey]).exec(client);
    expect(resCount).toBe(0);
  });
});
