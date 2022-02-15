import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HMSetCommand } from "./hmset"
import { HMGetCommand } from "./hmget"

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
  kv[field1] = randomUUID()
  kv[field2] = randomUUID()
  const res = await new HMSetCommand(key, kv).exec(client)

  expect(res).toEqual("OK")
  const res2 = await new HMGetCommand(key, field1, field2).exec(client)

  expect(res2).toEqual([value1, value2])
})
