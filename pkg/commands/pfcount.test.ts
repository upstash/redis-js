import { newHttpClient, keygen, randomID } from "../test-utils.ts";
import { afterEach, expect, test } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

test("simple cardinality check", () => {
  const key = newKey();

  test("insert multiple unique strings", async () => {
    const value1 = randomID();
    const value2 = randomID();
    const value3 = randomID();
    const res = await new PfAddCommand([key, value1, value2, value3]).exec(
      client
    );
    expect(res, 1, "Expected the HLL to be modified");
  });

  test("check cardinality", async () => {
    const count = await new PfCountCommand([key]).exec(client);
    expect(count, 3, "Expected the HLL to have cardinality of 3");
  });
});

test("multiple keys cardinality check", () => {
  const key1 = newKey();
  const key2 = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();
  const value5 = randomID();

  test("insert unique strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2]).exec(client);
    await new PfAddCommand([key2, value3, value4, value5]).exec(client);
  });

  test("check combined cardinality", async () => {
    const count = await new PfCountCommand([key1, key2]).exec(client);
    expect(count, 5, "Expected the combined HLLs to have cardinality of 5");
  });
});

test("cardinality after repeated insertions", () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  test("insert strings and then re-insert them", async () => {
    await new PfAddCommand([key, value1, value2]).exec(client);
    await new PfAddCommand([key, value1, value2]).exec(client);
  });

  test("check cardinality after repeated insertions", async () => {
    const count = await new PfCountCommand([key]).exec(client);
    expect(
      count,
      2,
      "Expected the HLL to have cardinality of 2 even after repeated insertions"
    );
  });
});
