import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { SAddCommand } from "./sadd";
import { SInterCommand } from "./sinter";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with single set", () => {
  test("returns the members of the set", async () => {
    const key = newKey();
    const value1 = { v: randomID() };
    const value2 = { v: randomID() };
    await new SAddCommand([key, value1, value2]).exec(client);
    const res = await new SInterCommand<{ v: string }>([key]).exec(client);
    expect(res.length).toBe(2);
    expect(res.map(({ v }) => v).includes(value1.v)).toBe(true);
    expect(res.map(({ v }) => v).includes(value2.v)).toBe(true);
  });
});

describe("with multiple sets", () => {
  test("returns the members of the set", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const value1 = { v: randomID() };
    const value2 = { v: randomID() };
    const value3 = { v: randomID() };
    await new SAddCommand([key1, value1, value2]).exec(client);
    await new SAddCommand([key2, value2, value3]).exec(client);
    const res = await new SInterCommand<{ v: string }>([key1, key2]).exec(client);
    expect(res).toEqual([value2]);
  });
});
