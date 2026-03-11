import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HSetCommand } from "./hset";
import { LPushCommand } from "./lpush";
import { SAddCommand } from "./sadd";
import { SetCommand } from "./set";
import { TypeCommand } from "./type";
import { ZAddCommand } from "./zadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("string", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("string");
  });
});

describe("list", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new LPushCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("list");
  });
});

describe("set", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new SAddCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("set");
  });
});

describe("hash", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const field = randomID();
    const value = randomID();
    await new HSetCommand([key, { [field]: value }]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("hash");
  });
});

describe("zset", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const member = randomID();
    await new ZAddCommand([key, { score: 0, member }]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("zset");
  });
});

describe("none", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("none");
  });
});
