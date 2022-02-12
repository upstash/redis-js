import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { ScanCommand } from "./scan"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns cursor and keys", async () => {
  const key = newKey()
  const value = randomUUID()
  await new SetCommand(key, value).exec(client)
  const res = await new ScanCommand(0).exec(client)
  expect(res.error).not.toBeDefined()

  expect(res.result).toBeDefined()
  expect(res.result!.length).toBe(2)
  console.warn({ f: __filename, res, key, value })
  expect(res.result![0]).toBeGreaterThan(0)
  expect(res.result![1].includes(value)).toBe(true)
})
