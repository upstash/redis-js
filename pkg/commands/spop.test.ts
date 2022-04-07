import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SPopCommand } from "./spop"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("without count", () => {
  it("returns the first element", async () => {
    const key = newKey()
    const member = randomUUID()
    await new SAddCommand([key, member]).exec(client)
    const res = await new SPopCommand([key]).exec(client)
    expect(res).toBe(member)
  })
})

describe("with count", () => {
  it("returns the first n elements", async () => {
    const key = newKey()
    const member1 = randomUUID()
    const member2 = randomUUID()
    const member3 = randomUUID()
    const member4 = randomUUID()
    await new SAddCommand([key, member1, member2, member3, member4]).exec(client)
    const res = await new SPopCommand<string[]>([key, 2]).exec(client)
    expect(res).not.toBeNull()
    expect(res!).toHaveLength(2)
    expect([member1, member2, member3, member4].includes(res![0])).toBe(true)
    expect([member1, member2, member3, member4].includes(res![1])).toBe(true)
  })
})
