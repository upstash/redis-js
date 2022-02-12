import { keygen, newHttpClient } from "../test-utils"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { KeysCommand } from "./keys"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when keys are found", () => {
  it("returns keys", async () => {
    const key = newKey()
    await new SetCommand(key, "value").exec(client)
    const res = await new KeysCommand(key).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual([key])
  })
})
