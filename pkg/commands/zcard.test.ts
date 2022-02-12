import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZCardCommand } from "./zcard"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the cardinality", async () => {
  const key = newKey()
  await new ZAddCommand(key, { score: 1, member: "member1" }).exec(client)
  const res = await new ZCardCommand(key).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(1)
})
