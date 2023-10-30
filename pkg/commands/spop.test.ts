import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SPopCommand } from "./spop";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without count", () => {
  test("returns the first element", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SPopCommand([key]).exec(client);
    expect(res).toEqual(member);
  });
});

describe("with count", () => {
  test("returns n elements", async () => {
    const key = newKey();
    const member1 = randomID();
    const member2 = randomID();
    const member3 = randomID();
    const member4 = randomID();
    await new SAddCommand([key, member1, member2, member3, member4]).exec(client);
    const res = await new SPopCommand<string[]>([key, 2]).exec(client);

    expect(res?.length).toBe(2);
    expect([member1, member2, member3, member4].includes(res![0])).toBe(true);
    expect([member1, member2, member3, member4].includes(res![1])).toBe(true);
  });
});
