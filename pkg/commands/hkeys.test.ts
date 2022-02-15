import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { HMSetCommand } from "./hmset"
import { HKeysCommand } from "./hkeys"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("with existing hash", () => {
  it("returns all keys", async () => {
    const key = newKey()
    const field1 = randomUUID()
    const field2 = randomUUID()
    await new HMSetCommand(
      key,
      { field: field1, value: randomUUID() },
      { field: field2, value: randomUUID() },
    ).exec(client)
    const res = await new HKeysCommand(key).exec(client)
    expect(res?.includes(field1)).toBe(true)
    expect(res?.includes(field2)).toBe(true)
  })
})
