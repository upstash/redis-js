import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { ZAddCommand } from "./zadd"
import { ZLexCountCommand } from "./zlexcount"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of elements in the specified score range", async () => {
  const key = newKey()
  await new ZAddCommand(
    key,
    { score: 0, member: "a" },
    { score: 0, member: "b" },
    { score: 0, member: "c" },
    { score: 0, member: "d" },
    { score: 0, member: "e" },
  ).exec(client)
  const res = await new ZLexCountCommand(key, "[b", "[f").exec(client)
  expect(res).toBe(4)
})
