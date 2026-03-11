import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { LPosCommand } from "./lpos";

import { RPushCommand } from "./rpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with single element", () => {
  test("returns 1", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new RPushCommand([key, value1, value2]).exec(client);
    const res = await new LPosCommand([key, value2]).exec(client);
    expect(res).toEqual(1);
  });
});

describe("with rank", () => {
  test("returns 6", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(client);
    const cmd = new LPosCommand([key, "c", { rank: 2 }]);
    expect(cmd.command).toEqual(["lpos", key, "c", "rank", 2]);
    const res = await cmd.exec(client);
    expect(res).toEqual(6);
  });
});
describe("with count", () => {
  test("returns 2,6", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(client);
    const res = await new LPosCommand<number[]>([key, "c", { count: 2 }]).exec(client);
    expect(res).toEqual([2, 6]);
  });
});

describe("with maxlen", () => {
  test("returns 2", async () => {
    const key = newKey();
    await new RPushCommand([key, "a", "b", "c", 1, 2, 3, "c", "c"]).exec(client);
    const res = await new LPosCommand<number[]>([
      key,
      "c",
      {
        count: 2,
        maxLen: 4,
      },
    ]).exec(client);
    expect(res).toEqual([2]);
  });
});
