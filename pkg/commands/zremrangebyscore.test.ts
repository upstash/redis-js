import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { ZAddCommand } from "./zadd"
import { it, expect, afterAll } from "@jest/globals"
import { ZRemRangeByScoreCommand } from "./zremrangebyscore"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of removed elements", async () => {
  const key = newKey()
  const member1 = randomUUID()
  const member2 = randomUUID()
  const member3 = randomUUID()
  await new ZAddCommand([
    key,
    { score: 1, member: member1 },
    { score: 2, member: member2 },
    { score: 3, member: member3 },
  ]).exec(client)
  const res = await new ZRemRangeByScoreCommand([key, 1, 2]).exec(client)
  expect(res).toBe(2)
})
