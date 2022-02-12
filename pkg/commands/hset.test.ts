import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HGetCommand } from "./hget"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)
it("sets value", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = randomUUID()

  const res = await new HSetCommand(key, field, value).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(1)
  const res2 = await new HGetCommand(key, field).exec(client)
  expect(res2.error).not.toBeDefined()
  expect(res2.result).toEqual(value)
})
