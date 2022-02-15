import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZCountCommand } from "./zcount"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the cardinality", async () => {
  const key = newKey()
  await new ZAddCommand(key, { score: 1, member: "member1" }).exec(client)
  const res = await new ZCountCommand(key, "-inf", "+inf").exec(client)
  expect(res).toBe(1)
})
