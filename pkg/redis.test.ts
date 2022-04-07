import { Redis } from "./redis"
import { keygen, newHttpClient } from "./test-utils"
import { describe, it, expect, afterEach } from "@jest/globals"
import { randomUUID } from "crypto"

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

describe("zrange", () => {
  it("returns the range", async () => {
    const key = newKey()
    const score = 1
    const member = randomUUID()
    const redis = new Redis(client)
    await redis.zadd(key, { score, member })
    const res = await redis.zrange(key, 0, 2)
    expect(res).toEqual([member])
  })
})
