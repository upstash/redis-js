import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { IncrByCommand } from "./incrby"
import { SetCommand } from "./set"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("increments a non-existing value", async () => {
  const key = newKey()
  const res = await new IncrByCommand(key, 2).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(2)
})

it("increments and existing value", async () => {
  const key = newKey()
  await new SetCommand(key, 5).exec(client)
  const res = await new IncrByCommand(key, 2).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(7)
})
