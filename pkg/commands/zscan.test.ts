import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZScanCommand } from "./zscan"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns cursor and keys", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = randomUUID()
  await new ZAddCommand(key, field, value).exec(client)
  const res = await new ZScanCommand(key, 0).exec(client)
  expect(res.error).not.toBeDefined()

  expect(res.result).toBeDefined()
  expect(res.result!.length).toBe(2)
  expect(res.result![0]).toBe(0)
  expect(res.result![1]).toEqual([field, value])
})
