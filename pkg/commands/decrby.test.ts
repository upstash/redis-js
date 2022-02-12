import { keygen, newHttpClient } from "../test-utils"
import { SetCommand } from "./set.ts"
import { it, expect, afterAll } from "@jest/globals"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("decrements a non-existing value", async () => {
  const key = newKey()
  const res = await new DecrByCommand(key, 2).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(-2)
})

it("decrements and existing value", async () => {
  const key = newKey()
  await new SetCommand(key, 5).exec(client)
  const res = await new DecrByCommand(key, 2).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(3)
})
