import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { SetCommand } from "./set"
import { it, expect, afterAll } from "@jest/globals"
import { PersistCommand } from "./persist"
import { GetCommand } from "./get"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("persists the key", async () => {
  const key = newKey()
  const value = randomUUID()
  await new SetCommand(key, value, { ex: 2 }).exec(client)
  const res = await new PersistCommand(key).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(1)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const res2 = await new GetCommand(key).exec(client)
  expect(res2.error).toBeUndefined()
  expect(res2.result).toEqual(value)
})
