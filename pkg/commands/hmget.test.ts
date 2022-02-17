import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, describe, afterAll } from "@jest/globals"

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
  const kv: Record<string, string> = {
    [field1]: value1,
    [field2]: value2,
  }
  const res = await new HMSetCommand(key, kv).exec(client)

  expect(res).toEqual("OK")
  const res2 = await new HMGetCommand(key, field1, field2).exec(client)

  expect(res2).toEqual(kv)
})

describe("when the hash does not exist", () => {
  it("returns null", async () => {
    const key = newKey()
    const res = await new HMGetCommand(key, randomUUID()).exec(client)

    expect(res).toBeNull()
  })
})

it("gets an object", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = { v: randomUUID() }
  await new HSetCommand(key, field, value).exec(client)
  const cmd = new HMGetCommand(key, field)
  const res = await cmd.exec(client)
  expect(res).toEqual({ [field]: value })
})
