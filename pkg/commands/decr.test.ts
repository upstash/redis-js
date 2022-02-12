import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { DecrCommand } from "./decr"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)
it("decrements a non-existing value", async () => {
  const key = newKey()
  const res = await new DecrCommand(key).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(-1)
})

it("decrements and existing value", async () => {
  const key = newKey()
  await new SetCommand(key, 4).exec(client)
  const res = await new DecrCommand(key).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(3)
})
