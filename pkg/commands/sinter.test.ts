import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SInterCommand } from "./sinter.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with single set", () => {
  it("returns the members of the set", async () => {
    const key = newKey();
    const value1 = { v: crypto.randomUUID() };
    const value2 = { v: crypto.randomUUID() };
    await new SAddCommand(key, value1, value2).exec(client);
    const res = await new SInterCommand<{ v: string }>(key).exec(client);
    assertEquals(res.length, 2);
    assertEquals(res.map(({ v }) => v).includes(value1.v), true);
    assertEquals(res.map(({ v }) => v).includes(value2.v), true);
  });
});

describe("with multiple sets", () => {
  it("returns the members of the set", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const value1 = { v: crypto.randomUUID() };
    const value2 = { v: crypto.randomUUID() };
    const value3 = { v: crypto.randomUUID() };
    await new SAddCommand(key1, value1, value2).exec(client);
    await new SAddCommand(key2, value2, value3).exec(client);
    const res = await new SInterCommand(key1, key2).exec(client);
    assertEquals(res, [value2]);
  });
});
