import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { StrLenCommand } from "./strlen"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the correct length", async () => {
  const key = newKey()
  const value = "abcd"
  await new SetCommand(key, value).exec(client)
  const res = await new StrLenCommand(key).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(value.length)
})
