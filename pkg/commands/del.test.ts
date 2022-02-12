import { keygen, newHttpClient } from "../test-utils"

import { DelCommand } from "./del"
import { SetCommand } from "./set"
import { describe, it, expect, afterAll } from "@jest/globals"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when key does not exist", () => {
  it("does nothing", async () => {
    const key = newKey()

    const res = await new DelCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(0)
  })
})
describe("when key does exist", () => {
  it("deletes the key", async () => {
    const key = newKey()
    await new SetCommand(key, "value").exec(client)
    const res = await new DelCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(1)
  })
})
describe("with multiple keys", () => {
  describe("when one does not exist", () => {
    it("deletes all keys", async () => {
      const key1 = newKey()
      const key2 = newKey()
      await new SetCommand(key1, "value").exec(client)
      const res = await new DelCommand(key1, key2).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual(1)
    })
  })
})
