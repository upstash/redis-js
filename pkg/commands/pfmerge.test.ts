import { newHttpClient, randomID, keygen } from "../test-utils.ts";

import { afterEach, expect, test } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";
import { PfMergeCommand } from "./pfmerge.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();

afterEach(cleanup);

test("merge HLLs with distinct values and count", () => {
  const key1 = newKey();
  const key2 = newKey();
  const mergedKey = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();

  test("insert distinct strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2]).exec(client);
    const res = await new PfAddCommand([key2, value3, value4]).exec(client);
    expect(res, 1, "Expected the HLL to be modified with distinct values");
  });

  test("merge the two HLLs with distinct values", async () => {
    const res = await new PfMergeCommand([mergedKey, key1, key2]).exec(client);
    expect(res, "OK", "Expected the HLLs with distinct values to be merged");
  });

  test("count merged distinct HLLs", async () => {
    const count = await new PfCountCommand([mergedKey]).exec(client);
    expect(
      count,
      4,
      "Expected the merged HLL to have a cardinality of 4 with distinct values"
    );
  });
});

test("merge HLL with an empty HLL", () => {
  const key = newKey();
  const emptyKey = newKey();
  const mergedKey = newKey();
  const value1 = randomID();

  test("insert a string into an HLL and keep another HLL empty", async () => {
    const res = await new PfAddCommand([key, value1]).exec(client);
    expect(res, 1, "Expected the HLL to be modified");
  });

  test("merge the HLL with an empty HLL", async () => {
    const res = await new PfMergeCommand([mergedKey, key, emptyKey]).exec(
      client
    );
    expect(res, "OK", "Expected the HLL to be merged with an empty HLL");
  });

  test("count after merging with empty HLL", async () => {
    const count = await new PfCountCommand([mergedKey]).exec(client);
    expect(
      count,
      1,
      "Expected the merged HLL to have a cardinality of 1 after merging with empty HLL"
    );
  });
});

test("merge two empty HLLs", () => {
  const emptyKey1 = newKey();
  const emptyKey2 = newKey();
  const mergedKey = newKey();

  test("merge two empty HLLs", async () => {
    const res = await new PfMergeCommand([
      mergedKey,
      emptyKey1,
      emptyKey2,
    ]).exec(client);
    expect(res, "OK", "Expected the two empty HLLs to be merged");
  });

  test("count merged empty HLLs", async () => {
    const count = await new PfCountCommand([mergedKey]).exec(client);
    expect(
      count,
      0,
      "Expected the merged HLL to have a cardinality of 0 after merging two empty HLLs"
    );
  });
});
