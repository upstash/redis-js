import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { SAddCommand } from "./sadd"
import { SIsMemberCommand } from "./sismember"
import { describe, it, expect, afterAll } from "@jest/globals"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when member exists", () => {
  it("returns 1", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SAddCommand([key, value]).exec(client)
    const res = await new SIsMemberCommand([key, value]).exec(client)
    expect(res).toBe(1)
  })
})

describe("when member exists", () => {
  it("returns 1", async () => {
    const key = newKey()
    const value1 = randomUUID()
    const value2 = randomUUID()
    await new SAddCommand([key, value1]).exec(client)
    const res = await new SIsMemberCommand([key, value2]).exec(client)
    expect(res).toBe(0)
  })
})
