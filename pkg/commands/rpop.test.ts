import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { RPopCommand } from "./rpop";
import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  it("returns the first element", async () => {
    const key = newKey()
    const value = randomUUID()
    await new LPushCommand([key, value]).exec(client)
    const res = await new RPopCommand([key]).exec(client)
    expect(res).toEqual(value)
  })
})

describe("when list does not exist", () => {
  it("returns null", async () => {
    const key = newKey()
    const res = await new RPopCommand([key]).exec(client)
    expect(res).toBeNull()
  })
})
