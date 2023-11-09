import { newHttpClient, keygen, randomID } from "../test-utils.ts";
import { afterEach, expect, test, describe } from "bun:test";

import { PfAddCommand } from "./pfadd.ts";
import { PfCountCommand } from "./pfcount.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("simple cardinality check", () => {
  const key = newKey();

  test("insert multiple unique strings", async () => {
    const value1 = randomID();
    const value2 = randomID();
    const value3 = randomID();
    await new PfAddCommand([key, value1, value2, value3]).exec(client);

    const resCount = await new PfCountCommand([key]).exec(client);
    expect(resCount).toBe(3);
  });
});

describe("multiple keys cardinality check", () => {
  const key1 = newKey();
  const key2 = newKey();
  const value1 = randomID();
  const value2 = randomID();
  const value3 = randomID();
  const value4 = randomID();
  const value5 = randomID();

  test("insert unique strings into two HLLs", async () => {
    await new PfAddCommand([key1, value1, value2]).exec(client);
    await new PfAddCommand([key2, value3, value4]).exec(client);

    const resCount = await new PfCountCommand([key1, key2]).exec(client);
    expect(resCount).toBe(4);
  });
});

describe("cardinality after repeated insertions", () => {
  const key = newKey();
  const value1 = randomID();
  const value2 = randomID();

  test("insert strings and then re-insert them", async () => {
    await new PfAddCommand([key, value1, value2]).exec(client);
    await new PfAddCommand([key, value1, value2]).exec(client);

    const resCount = await new PfCountCommand([key]).exec(client);
    expect(resCount).toBe(2);
  });
});
