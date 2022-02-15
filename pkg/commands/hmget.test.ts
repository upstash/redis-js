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
  const kv: Record<string, string> = {}
  kv[field1] = value1
  kv[field2] = value2
  const res = await new HMSetCommand(key, kv).exec(client)

  expect(res).toEqual("OK")
  const res2 = await new HMGetCommand(key, field1, field2).exec(client)

  expect(res2).toEqual([value1, value2])
})

it("gets a non-existing value", async () => {
  const key = newKey()
  const res = await new HMGetCommand(key, randomUUID()).exec(client)

  expect(res).toEqual([null])
})

it("gets an object", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = { v: randomUUID() }
  await new HSetCommand(key, field, value).exec(client)
  const res = await new HMGetCommand(key, field).exec(client)

  expect(res).toEqual([value])
})
