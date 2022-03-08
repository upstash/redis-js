import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { RandomKeyCommand } from "./randomkey"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns a random key", async () => {
  const key = newKey()
  await new SetCommand(key, randomUUID()).exec(client)
  const res = await new RandomKeyCommand().exec(client)
  expect(res).toBeDefined()
  expect(typeof res).toBe("string")
})
