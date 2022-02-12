import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { HMSetCommand } from "./hmset"
import { HLenCommand } from "./hlen"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("with existing hash", () => {
  it("returns correct number of keys", async () => {
    const key = newKey()
    const field1 = randomUUID()
    const field2 = randomUUID()
    await new HMSetCommand(
      key,
      { field: field1, value: randomUUID() },
      { field: field2, value: randomUUID() },
    ).exec(client)
    const res = await new HLenCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(2)
  })
})
