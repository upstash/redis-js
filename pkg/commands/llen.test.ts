import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { LLenCommand } from "./llen";

import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  test("returns the length of the list", async () => {
    const key = newKey();
    await new LPushCommand([key, randomID()]).exec(client);
    const res = await new LLenCommand([key]).exec(client);
    expect(res).toEqual(1);
  });
});

describe("when list does not exist", () => {
  test("returns 0", async () => {
    const key = newKey();
    const res = await new LLenCommand([key]).exec(client);
    expect(res).toEqual(0);
  });
});
