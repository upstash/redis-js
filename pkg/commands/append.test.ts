import { AppendCommand } from "./append.ts";
import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  it("appends to empty value", async () => {
    const key = newKey();
    const value = Math.random().toString();
    const res = await new AppendCommand(key, value).exec(client);
    assertEquals(res, value.length);
  });
});

describe("when key is set", () => {
  it("appends to existing value", async () => {
    const key = newKey();
    const value = Math.random().toString();
    const res = await new AppendCommand(key, value).exec(client);
    assertEquals(res, value.length);
    const res2 = await new AppendCommand(key, "_").exec(client);
    assertEquals(res2, value.length + 1);
  });
});
