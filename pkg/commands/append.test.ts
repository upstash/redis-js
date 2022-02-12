import { AppendCommand } from "./append"
import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when key is not set", () => {
  it("appends to empty value", async () => {
    const key = newKey()
    const value = randomUUID()
    const res = await new AppendCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value.length)
  })
})
