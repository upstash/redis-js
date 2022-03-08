import { newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect } from "@jest/globals"
import { PingCommand } from "./ping"
const client = newHttpClient()

describe("with message", () => {
  it("returns the message", async () => {
    const message = randomUUID()
    const res = await new PingCommand(message).exec(client)
    expect(res).toBe(message)
  })
})
describe("without message", () => {
  it("returns pong", async () => {
    const res = await new PingCommand().exec(client)
    expect(res).toBe("PONG")
  })
})
