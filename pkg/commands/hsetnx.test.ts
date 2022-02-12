import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HGetCommand } from "./hget"
import { HSetNXCommand } from "./hsetnx"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when hash exists already", () => {
  it("returns 0", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()
    const newValue = randomUUID()
    await new HSetCommand(key, field, value).exec(client)
    const res = await new HSetNXCommand(key, field, newValue).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(0)
    const res2 = await new HGetCommand(key, field).exec(client)
    expect(res2.error).toBeUndefined()
    expect(res2.result).toEqual(value)
  })
})
describe("when hash does not exist", () => {
  it("returns 1", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()
    const res = await new HSetNXCommand(key, field, value).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(1)
    const res2 = await new HGetCommand(key, field).exec(client)
    expect(res2.error).toBeUndefined()
    expect(res2.result).toEqual(value)
  })
})
