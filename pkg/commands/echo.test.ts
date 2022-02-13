import { newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect } from "@jest/globals"
import { EchoCommand } from "./echo"
const client = newHttpClient()

it("returns the message", async () => {
  const message = randomUUID()
  const res = await new EchoCommand(message).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(message)
})
