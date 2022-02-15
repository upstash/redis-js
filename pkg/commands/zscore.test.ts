import { keygen, newHttpClient } from "../test-utils"
import { randomInt, randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZScoreCommand } from "./zscore"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the score", async () => {
  const key = newKey()
  const member = randomUUID()
  const score = randomInt(10)
  await new ZAddCommand(key, { score, member }).exec(client)
  const res = await new ZScoreCommand(key, member).exec(client)
  expect(res).toBe(score)
})
