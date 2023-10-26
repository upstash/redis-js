import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { LPopCommand } from "./lpop";

import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("when list exists", () => {
  test("returns the first element", async () => {
    const key = newKey();
    const value = randomID();
    await new LPushCommand([key, value]).exec(client);
    const res = await new LPopCommand([key]).exec(client);
    expect(res).toEqual(value);
  });
});

test("when list does not exist", () => {
  test("returns null", async () => {
    const key = newKey();
    const res = await new LPopCommand([key]).exec(client);
    expect(res).toEqual(null);
  });
});

test("with count", () => {
  test("returns 2 elements", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new LPushCommand([key, value1, value2]).exec(client);
    const res = await new LPopCommand<string[]>([key, 2]).exec(client);
    expect(res).toBeTruthy();
    expect([value1, value2]).toContain(res);
  });
});
