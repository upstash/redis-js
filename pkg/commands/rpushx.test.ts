import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { RPushXCommand } from "./rpushx";

import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  test("returns the length after command", async () => {
    const key = newKey();
    await new LPushCommand([key, randomID()]).exec(client);
    const res = await new RPushXCommand([key, randomID()]).exec(client);
    expect(res).toEqual(2);
    const res2 = await new RPushXCommand([key, randomID(), randomID()]).exec(client);

    expect(res2).toEqual(4);
  });
});

describe("when list does not exist", () => {
  test("does nothing", async () => {
    const key = newKey();
    const res = await new RPushXCommand([key, randomID()]).exec(client);
    expect(res).toEqual(0);
  });
});
