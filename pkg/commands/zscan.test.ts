import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZScanCommand } from "./zscan";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const value = randomID();
    await new ZAddCommand([key, { score: 0, member: value }]).exec(client);
    const res = await new ZScanCommand([key, 0]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with match", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const value = randomID();
    await new ZAddCommand([key, { score: 0, member: value }]).exec(client);
    const res = await new ZScanCommand([key, "0", { match: value }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with count", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const value = randomID();
    await new ZAddCommand([key, { score: 0, member: value }]).exec(client);
    const res = await new ZScanCommand([key, "0", { count: 1 }]).exec(client);

    expect(res.length).toBe(2);

    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});
