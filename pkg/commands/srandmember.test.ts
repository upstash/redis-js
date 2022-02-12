import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SRandMemberCommand } from "./srandmember"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("without opts", () => {
  it("returns a random key", async () => {
    const key = newKey()
    const member = randomUUID()
    await new SAddCommand(key, member).exec(client)
    const res = await new SRandMemberCommand(key).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBeDefined()
    expect(res.result).toBe(member)
  })
})

describe("with count", () => {
  it("returns a random key", async () => {
    const key = newKey()
    const member1 = randomUUID()
    const member2 = randomUUID()
    await new SAddCommand(key, member1, member2).exec(client)
    const res = await new SRandMemberCommand(key, 2).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBeDefined()
    expect(res.result).toHaveLength(2)
  })
})
