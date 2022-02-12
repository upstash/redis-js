import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HGetCommand } from "./hget"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("gets an exiting value", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = randomUUID()
  await new HSetCommand(key, field, value).exec(client)
  const res = await new HGetCommand(key, field).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(value)
})

it("gets a non-existing hash", async () => {
  const key = newKey()
  const field = randomUUID()
  const res = await new HGetCommand(key, field).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toBeNull()
})

it("gets a non-existing field", async () => {
  const key = newKey()
  const field = randomUUID()
  await new HSetCommand(key, randomUUID(), randomUUID()).exec(client)
  const res = await new HGetCommand(key, field).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toBeNull()
})

it("gets an object", async () => {
  const key = newKey()
  const field = randomUUID()
  const value = { v: randomUUID() }
  await new HSetCommand(key, field, value).exec(client)
  const res = await new HGetCommand(key, field).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual(value)
})
