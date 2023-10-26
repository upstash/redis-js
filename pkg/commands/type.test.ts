import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HSetCommand } from "./hset";
import { LPushCommand } from "./lpush";
import { SAddCommand } from "./sadd";
import { SetCommand } from "./set";
import { TypeCommand } from "./type";
import { ZAddCommand } from "./zadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("string", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("string");
  });
});

test("list", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new LPushCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("list");
  });
});

test("set", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const value = randomID();
    await new SAddCommand([key, value]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("set");
  });
});

test("hash", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const field = randomID();
    const value = randomID();
    await new HSetCommand([key, { [field]: value }]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("hash");
  });
});

test("zset", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const member = randomID();
    await new ZAddCommand([key, { score: 0, member }]).exec(client);
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("zset");
  });
});

test("none", () => {
  test("returns the correct type", async () => {
    const key = newKey();
    const res = await new TypeCommand([key]).exec(client);
    expect(res).toEqual("none");
  });
});
