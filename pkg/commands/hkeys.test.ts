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
    const kv = {
      [randomUUID()]: randomUUID(),
      [randomUUID()]: randomUUID(),
    }
    await new HMSetCommand([key, kv]).exec(client)
    const res = await new HKeysCommand([key]).exec(client)
    expect(res.sort()).toEqual(Object.keys(kv).sort())
  })
})
