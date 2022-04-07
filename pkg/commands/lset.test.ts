import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { LPushCommand } from "./lpush"
import { LSetCommand } from "./lset"
import { LPopCommand } from "./lpop"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when list exists", () => {
  describe("when the index is in range", () => {
    it("replaces the element at index", async () => {
      const key = newKey()

      const value = randomUUID()
      const newValue = randomUUID()
      await new LPushCommand([key, value]).exec(client)
      const res = await new LSetCommand([key, 0, newValue]).exec(client)
      expect(res).toEqual("OK")

      const res2 = await new LPopCommand([key]).exec(client)

      expect(res2).toEqual(newValue)
    })
    describe("when the index is out of bounds", () => {
      it("returns null", async () => {
        const key = newKey()

        const value = randomUUID()
        const newValue = randomUUID()
        await new LPushCommand([key, value]).exec(client)
        expect(
          async () => await new LSetCommand([key, 1, newValue]).exec(client),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"ERR index out of range"`)
      })
    })
  })
})
