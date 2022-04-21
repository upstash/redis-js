import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { LLenCommand } from "./llen";
import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  it("returns the length of the list", async () => {
    const key = newKey()
    await new LPushCommand([key, randomUUID()]).exec(client)
    const res = await new LLenCommand([key]).exec(client)
    expect(res).toEqual(1)
  })
})

describe("when list does not exist", () => {
  it("returns 0", async () => {
    const key = newKey()
    const res = await new LLenCommand([key]).exec(client)
    expect(res).toEqual(0)
  })
})
