import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { LPushCommand } from "./lpush"
import { LIndexCommand } from "./lindex"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when list exists", () => {
  describe("when the index is in range", () => {
    it("returns the element at index", async () => {
      const key = newKey()

      const value = randomUUID()
      await new LPushCommand(key, value).exec(client)
      const res = await new LIndexCommand(key, 0).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toEqual(value)
    })
    describe("when the index is out of bounds", () => {
      it("returns null", async () => {
        const key = newKey()

        const value = randomUUID()
        await new LPushCommand(key, value).exec(client)
        const res = await new LIndexCommand(key, 1).exec(client)
        expect(res.error).toBeUndefined()
        expect(res.result).toBeNull()
      })
    })
  })
})
