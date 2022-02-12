import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { TypeCommand } from "./type"
import { LPushCommand } from "./lpush"
import { HSetCommand } from "./hset"
import { SAddCommand } from "./sadd"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("string", () => {
  it("returns the correct type", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new TypeCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("string")
  })
})

describe("list", () => {
  it("returns the correct type", async () => {
    const key = newKey()
    const value = randomUUID()
    await new LPushCommand(key, value).exec(client)
    const res = await new TypeCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("list")
  })
})

describe("set", () => {
  it("returns the correct type", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SAddCommand(key, value).exec(client)
    const res = await new TypeCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("string")
  })
})

describe("hash", () => {
  it("returns the correct type", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()
    await new HSetCommand(key, field, value).exec(client)
    const res = await new TypeCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("hash")
  })
})

describe("zset", () => {
  it("returns the correct type", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new TypeCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("string")
  })
})
