import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SCardCommand } from "./scard"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the cardinality", async () => {
  const key = newKey()
  await new SAddCommand([key, "member1"]).exec(client)
  const res = await new SCardCommand([key]).exec(client)
  expect(res).toBe(1)
})
