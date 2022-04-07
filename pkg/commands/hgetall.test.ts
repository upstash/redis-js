import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HGetAllCommand } from "./hgetall"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)
it("returns all fields", async () => {
  const key = newKey()
  const field2 = randomUUID()
  const field1 = randomUUID()
  const value1 = false
  const value2 = randomUUID()
  await new HSetCommand([key, { [field1]: value1, [field2]: value2 }]).exec(client)

  const res = await new HGetAllCommand([key]).exec(client)

  const obj = {
    [field1]: value1,
    [field2]: value2,
  }
  expect(res).toEqual(obj)
})
describe("when hash does not exist", () => {
  it("it returns null", async () => {
    const res = await new HGetAllCommand([randomUUID()]).exec(client)
    expect(res).toBeNull()
  })
})
