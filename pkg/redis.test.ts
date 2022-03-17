import { keygen, newHttpClient } from "./test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterEach } from "@jest/globals"
import { Redis } from "./redis"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterEach(cleanup)

describe("when destructuring the redis class", () => {
  it("correctly binds this", async () => {
    const { get, set } = new Redis(client)
    const key = newKey()
    const value = randomUUID()
    await set(key, value)
    const res = await get(key)
    expect(res).toEqual(value)
  })
})

describe("zadd", () => {
  it("adds the set", async () => {
    const key = newKey()
    const score = 1
    const member = randomUUID()

    const res = await new Redis(client).zadd(key, { score, member })
    expect(res).toBe(1)
  })
})
