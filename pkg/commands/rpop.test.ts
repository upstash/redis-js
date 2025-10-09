import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { RPopCommand } from "./rpop";

import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  test("returns the last element", async () => {
    const key = newKey();
    const value = randomID();
    await new LPushCommand([key, value]).exec(client);
    const res = await new RPopCommand([key]).exec(client);
    expect(res).toEqual(value);
  });
});

describe("when list does not exist", () => {
  test("returns null", async () => {
    const key = newKey();
    const res = await new RPopCommand([key]).exec(client);
    expect(res).toEqual(null);
  });
});

describe("with count", () => {
  test("returns 2 elements", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new LPushCommand([key, value1, value2]).exec(client);
    const res = await new RPopCommand<string[]>([key, 2]).exec(client);
    expect(res).toBeTruthy();
    expect(res).toEqual([value1, value2]);
  });
});
