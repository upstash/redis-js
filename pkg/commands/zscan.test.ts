import { keygen, newHttpClient } from "../test-utils"
import { randomInt, randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZScanCommand } from "./zscan"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns cursor and keys", async () => {
  const key = newKey()
  const score = randomInt(10)
  const member = randomUUID()
  await new ZAddCommand(key, { score, member }).exec(client)
  const res = await new ZScanCommand(key, 0).exec(client)

  expect(res).toBeDefined()
  expect(res!.length).toBe(2)
  expect(res![0]).toBe(0)
  expect(res![1]).toEqual([member, score])
})
