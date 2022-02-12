import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { EchoCommand } from "./echo"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the message", async () => {
  const message = randomUUID()
  const res = await new EchoCommand(message).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(message)
})
