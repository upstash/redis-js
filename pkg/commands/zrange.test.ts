import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZRangeCommand } from "./zrange"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("without options", () => {
  it("returns the set", async () => {
    const key = newKey()
    const score1 = 2
    const member1 = randomUUID()

    const score2 = 5
    const member2 = randomUUID()

    await new ZAddCommand(
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ).exec(client)

    const res = await new ZRangeCommand(key, 1, 3).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toHaveLength(1)
    expect(res.result![0]).toEqual(member2)
  })
})

describe("withscores", () => {
  it("returns the set", async () => {
    const key = newKey()
    const score1 = 2
    const member1 = randomUUID()

    const score2 = 5
    const member2 = randomUUID()

    await new ZAddCommand(
      key,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ).exec(client)

    const res = await new ZRangeCommand(key, 1, 3, { withScores: true }).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toHaveLength(2)
    expect(res.result![0]).toEqual(member2)
    expect(res.result![1]).toEqual(score2)
  })
})
