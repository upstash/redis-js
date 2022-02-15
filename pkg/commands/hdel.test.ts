import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HDelCommand } from "./hdel"
import { HSetCommand } from "./hset"
import { HGetCommand } from "./hget"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("deletes a hash that does not exist", async () => {
  const key = newKey()
  const field = randomUUID()
  const res = await new HDelCommand(key, field).exec(client)

  expect(res).toEqual(0)
})

it("deletes a field that exists", async () => {
  const key = newKey()
  const field = randomUUID()
  await new HSetCommand(key, field, randomUUID()).exec(client)
  const res = await new HDelCommand(key, field).exec(client)

  expect(res).toEqual(1)
  const res2 = await new HGetCommand(key, field).exec(client)

  expect(res2).toEqual(null)
})
