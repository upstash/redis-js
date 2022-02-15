import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { RPushXCommand } from "./rpushx"
import { LPushCommand } from "./lpush"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when list exists", () => {
  it("returns the length after command", async () => {
    const key = newKey()
    await new LPushCommand(key, randomUUID()).exec(client)
    const res = await new RPushXCommand(key, randomUUID()).exec(client)
    expect(res).toEqual(2)
    const res2 = await new RPushXCommand(key, randomUUID(), randomUUID()).exec(client)

    expect(res2).toEqual(4)
  })
})

describe("when list does not exist", () => {
  it("does nothing", async () => {
    const key = newKey()
    const res = await new RPushXCommand(key, randomUUID()).exec(client)
    expect(res).toEqual(0)
  })
})
