import { newHttpClient, randomID, keygen } from "../test-utils.ts";

import { afterEach, expect, test } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";
import { PfMergeCommand } from "./pfmerge.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

test("adding multiple elements at once", () => {
  const key = newKey();
  test("returns 1 if the HLL was modified", async () => {
    const value1 = randomID();
    const value2 = randomID();
    const value3 = randomID();

    const res = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(res, 1, "Expected the HLL to be modified when adding elements");
  });
  test("returns 3 as a cardinality of the HLL", async () => {
    const res = await new PfCountCommand([key]).exec(client);

    expect(res, 3, "Expected the HLL to have cardinality of 3");
  });
});

test("inserting the same element multiple times", () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  test("returns 1 if the HLL was modified with repeated elements", async () => {
    const resInsert = await new PfAddCommand([
      key,
      value1,
      value1,
      value2,
      value2,
    ]).exec(client);
    expect(
      resInsert,
      1,
      "Expected the HLL to be modified when adding repeated elements"
    );
  });

  test("returns 2 as a cardinality of the HLL with repeated elements", async () => {
    const resCount = await new PfCountCommand([key]).exec(client);
    expect(resCount, 2, "Expected the HLL to have cardinality of 2");
  });
});

test("adding the same strings on different lines doesn't modify the HLL", () => {
  const key = newKey();

  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();

  test("modifies the HLL on the first insertion of strings", async () => {
    const res = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(res, 1, "Expected the HLL to be modified on the first insertion");
  });

  test("doesn't modify the HLL on the second insertion of same strings", async () => {
    const res = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(
      res,
      0,
      "Expected the HLL not to be modified on the second insertion"
    );
  });

  test("doesn't modify the HLL on the third insertion with a subset of strings", async () => {
    const res = await new PfAddCommand([key, value1, value2]).exec(client);
    expect(
      res,
      0,
      "Expected the HLL not to be modified on the third insertion"
    );
  });
});

test("merge HLLs with overlapping values and count", () => {
  const key1 = newKey();
  const key2 = newKey();
  const mergedKey = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();

  test("insert overlapping strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2, value3]).exec(client);
    const res = await new PfAddCommand([key2, value3, value4]).exec(client);
    expect(res, 1, "Expected the HLL to be modified with overlapping value");
  });

  test("merge the two HLLs with overlapping values", async () => {
    const res = await new PfMergeCommand([mergedKey, key1, key2]).exec(client);
    expect(res, "OK", "Expected the HLLs to be merged");
  });

  test("count merged overlapping HLLs", async () => {
    const count = await new PfCountCommand([mergedKey]).exec(client);
    expect(
      count,
      4,
      "Expected the merged HLL to have a cardinality of 4 after overlapping values were merged"
    );
  });
});
