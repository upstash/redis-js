import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { SetBitCommand } from "./setbit"
import { GetBitCommand } from "./getbit"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the bit at offset", async () => {
  const key = newKey()

  await new SetBitCommand([key, 0, 1]).exec(client)
  const res = await new GetBitCommand([key, 0]).exec(client)
  expect(res).toBe(1)
})
