import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { LPushCommand } from "./lpush"
import { LTrimCommand } from "./ltrim"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when the list exists", () => {
  it("returns ok", async () => {
    const key = newKey()
    await new LPushCommand(key, randomUUID()).exec(client)
    await new LPushCommand(key, randomUUID()).exec(client)
    await new LPushCommand(key, randomUUID()).exec(client)
    const res = await new LTrimCommand(key, 1, 2).exec(client)
    expect(res).toEqual("OK")
  })
})

describe("when the list does not exist", () => {
  it("returns ok", async () => {
    const key = newKey()

    const res = await new LTrimCommand(key, 1, 2).exec(client)
    expect(res).toEqual("OK")
  })
})
