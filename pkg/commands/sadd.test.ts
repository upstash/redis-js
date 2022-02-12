import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of added members", async () => {
  const key = newKey()
  const value1 = randomUUID()
  const value2 = randomUUID()
  const res = await new SAddCommand(key, value1, value2).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(2)
})
