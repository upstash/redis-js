import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SMoveCommand } from "./smove"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("moves the member", async () => {
  const source = newKey()
  const destination = newKey()
  const member = randomUUID()
  await new SAddCommand(source, member).exec(client)
  const res = await new SMoveCommand(source, destination, member).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(1)
})
