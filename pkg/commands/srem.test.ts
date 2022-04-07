import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { SAddCommand } from "./sadd"
import { it, expect, afterAll } from "@jest/globals"
import { SRemCommand } from "./srem"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of removed members", async () => {
  const key = newKey()
  const value1 = randomUUID()
  const value2 = randomUUID()
  await new SAddCommand([key, value1, value2]).exec(client)
  const res = await new SRemCommand([key, value1]).exec(client)
  expect(res).toBe(1)
})
