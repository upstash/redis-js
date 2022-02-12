import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { GetCommand } from "./get"
import { SetCommand } from "./set"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)
describe("without options", () => {
  it("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new SetCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value)
  })
})
describe("ex", () => {
  it("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new SetCommand(key, value, { ex: 1 }).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value)
    await new Promise((res) => setTimeout(res, 2000))

    const res3 = await new GetCommand(key).exec(client)
    expect(res3.error).not.toBeDefined()
    expect(res3.result).toEqual(null)
  })
})
describe("px", () => {
  it("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new SetCommand(key, value, { px: 1000 }).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value)
    await new Promise((res) => setTimeout(res, 2000))

    const res3 = await new GetCommand(key).exec(client)
    expect(res3.error).not.toBeDefined()
    expect(res3.result).toEqual(null)
  })
})
describe("nx", () => {
  describe("when key exists", () => {
    it("does nothing", async () => {
      const key = newKey()
      const value = randomUUID()
      const newValue = randomUUID()

      await new SetCommand(key, value).exec(client)
      const res = await new SetCommand(key, newValue, {
        nx: true,
      }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toBeNull()
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(value)
    })
  })
  describe("when key does not exists", () => {
    it("overwrites key", async () => {
      const key = newKey()
      const value = randomUUID()

      const res = await new SetCommand(key, value, {
        nx: true,
      }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual("OK")
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(value)
    })
  })
})
describe("xx", () => {
  describe("when key exists", () => {
    it("overwrites key", async () => {
      const key = newKey()
      const value = randomUUID()
      const newValue = randomUUID()

      await new SetCommand(key, value).exec(client)
      const res = await new SetCommand(key, newValue, {
        xx: true,
      }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual("OK")
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(newValue)
    })
  })
  describe("when key does not exists", () => {
    it("does nothing", async () => {
      const key = newKey()
      const value = randomUUID()

      const res = await new SetCommand(key, value, {
        xx: true,
      }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toBeNull()
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toBeNull()
    })
  })
})
