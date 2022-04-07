import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { RPushCommand } from "./rpush"
import { LRangeCommand } from "./lrange"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the correct range", async () => {
  const key = newKey()
  const value1 = randomUUID()
  const value2 = randomUUID()
  const value3 = randomUUID()
  await new RPushCommand([key, value1, value2, value3]).exec(client)
  const res = await new LRangeCommand([key, 1, 2]).exec(client)
  expect(res).toBeDefined()
  expect(res!.length).toEqual(2)
  expect(res![0]).toEqual(value2)
  expect(res![1]).toEqual(value3)
})
