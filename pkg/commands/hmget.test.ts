import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"

import { HMSetCommand } from "./hmset"
import { HMGetCommand } from "./hmget"
import { HSetCommand } from "./hset"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("gets exiting values", async () => {
  const key = newKey()
  const field1 = randomUUID()
  const value1 = randomUUID()
  const field2 = randomUUID()
  const value2 = randomUUID()
  const res = await new HMSetCommand(
    key,
    { field: field1, value: value1 },
    { field: field2, value: value2 },
  ).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual("OK")
  const res2 = await new HMGetCommand(key, field1, field2).exec(client)
  expect(res2.error).not.toBeDefined()
  expect(res2.result).toEqual([value1, value2])
})

it("gets a non-existing value", async () => {
  const key = newKey()
  const res = await new HMGetCommand(key, randomUUID()).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual([null])
})

it("gets an object", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = { v: randomUUID() }
  await new HSetCommand(key, field, value).exec(client)
  const res = await new HMGetCommand(key, field).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual([value])
})
