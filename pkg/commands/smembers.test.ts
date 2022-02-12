import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SMembersCommand } from "./smembers"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns all members of the set", async () => {
  const key = newKey()
  const value1 = { v: randomUUID() }
  const value2 = { v: randomUUID() }

  await new SAddCommand(key, value1, value2).exec(client)
  const res = await new SMembersCommand<{ v: string }>(key).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBeDefined()
  expect(res.result!.length).toBe(2)
  expect(res.result!.includes(value1)).toBe(true)
  expect(res.result!.includes(value2)).toBe(true)
})
