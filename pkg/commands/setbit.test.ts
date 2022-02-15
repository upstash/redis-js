import { keygen, newHttpClient } from "../test-utils"
import { SetBitCommand } from "./setbit"
import { it, expect, afterAll } from "@jest/globals"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the original bit", async () => {
  const key = newKey()
  const res = await new SetBitCommand(key, 0, 1).exec(client)
  expect(res).toBe(0)
  const res2 = await new SetBitCommand(key, 0, 1).exec(client)

  expect(res2).toBe(1)
})
