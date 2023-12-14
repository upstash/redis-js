import { keygen, newHttpClient, randomID } from "../test-utils";
import { Command } from "./command";

import { afterAll, describe, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZRangeCommand } from "./zrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("deserialize large numbers", () => {
  test("returns the correct number", async () => {
    const key = newKey();
    const field = randomID();
    const value = "101600000000150081467";

    await new Command(["hset", key, field, value]).exec(client);

    const res = await new Command(["hget", key, field]).exec(client);
    expect(res).toEqual(value);
  });
});

describe("Abort", () => {
  test("should abort one of the calls", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const key = newKey();

    await new ZAddCommand([key, { score: 1, member: "one" }]).exec(client);
    controller.abort();
    await new ZAddCommand([key, { score: 2, member: "two" }], {
      signal,
    }).exec(client);
    await new ZAddCommand([key, { score: 3, member: "three" }]).exec(client);

    const res2 = await new ZRangeCommand([
      key,
      0,
      -1,
      { withScores: true },
    ]).exec(client);

    expect(res2).toEqual(["one", 1, "three", 3]);
  });
});
