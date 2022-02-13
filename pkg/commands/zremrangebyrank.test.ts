import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZRemRangeByRankCommand } from "./zremrangebyrank"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of removed elements", async () => {
  const key = newKey()
  const score1 = 1
  const member1 = randomUUID()
  const score2 = 2
  const member2 = randomUUID()
  const score3 = 3
  const member3 = randomUUID()
  await new ZAddCommand(
    key,
    { score: score1, member: member1 },
    { score: score2, member: member2 },
    { score: score3, member: member3 },
  ).exec(client)
  const res = await new ZRemRangeByRankCommand(key, 1, 2).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(2)
})
