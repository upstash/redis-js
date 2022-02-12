import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { LPushXCommand } from "./lpushx"
import { LPushCommand } from "./lpush"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when list exists", () => {
  it("returns the length after command", async () => {
    const key = newKey()
    await new LPushCommand(key, randomUUID()).exec(client)
    const res = await new LPushXCommand(key, randomUUID()).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(2)
    const res2 = await new LPushXCommand(key, randomUUID(), randomUUID()).exec(client)
    expect(res2.error).toBeUndefined()
    expect(res2.result).toEqual(4)
  })
})

describe("when list does not exist", () => {
  it("does nothing", async () => {
    const key = newKey()
    const res = await new LPushXCommand(key, randomUUID()).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(0)
  })
})
