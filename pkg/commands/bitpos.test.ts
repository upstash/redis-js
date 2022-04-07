import { BitPosCommand } from "./bitpos"
import { keygen, newHttpClient } from "../test-utils"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when key is not set", () => {
  it("returns 0", async () => {
    const key = newKey()
    const res = await new BitPosCommand([key, 1, 1]).exec(client)
    expect(res).toEqual(-1)
  })
})

describe("when key is set", () => {
  it("returns position of first set bit", async () => {
    const key = newKey()
    const value = "Hello World"
    await new SetCommand([key, value]).exec(client)
    const res = await new BitPosCommand([key, 2, 3]).exec(client)
    expect(res).toEqual(24)
  })
})
