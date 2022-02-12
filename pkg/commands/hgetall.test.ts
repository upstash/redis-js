import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HGetAllCommand } from "./hgetall"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns all fields", async () => {
  const key = newKey()
  const field1 = randomUUID()
  const field2 = randomUUID()
  const value1 = false
  const value2 = true
  await new HSetCommand(key, field1, value1).exec(client)
  await new HSetCommand(key, field2, value2).exec(client)
  const res = await new HGetAllCommand<[string, boolean, string, boolean]>(key).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toBeDefined()
  expect(res.result?.includes(field1)).toBe(true)
  expect(res.result?.includes(field2)).toBe(true)
  expect(res.result?.includes(value1)).toBe(true)
  expect(res.result?.includes(value2)).toBe(true)
})
describe("when hash does not exist", () => {
  it("it returns an empty array", async () => {
    const res = await new HGetAllCommand(randomUUID()).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeDefined()
    expect(res.result!.length).toBe(0)
  })
})
