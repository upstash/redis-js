import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HScanCommand } from "./hscan"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns cursor and keys", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = randomUUID()
  await new HSetCommand(key, field, value).exec(client)
  const res = await new HScanCommand(key, 0).exec(client)
  expect(res.error).not.toBeDefined()

  expect(res.result).toBeDefined()
  expect(res.result!.length).toBe(2)
  expect(res.result![0]).toBe(0)
  expect(res.result![1]).toEqual([field, value])
})
