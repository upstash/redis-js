import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { MSetCommand } from "./mset"
import { TouchCommand } from "./touch"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns the number of touched keys", async () => {
  const key1 = newKey()
  const key2 = newKey()
  await new MSetCommand(
    { key: key1, value: randomUUID() },
    { key: key2, value: randomUUID() },
  ).exec(client)

  const res = await new TouchCommand(key1, key2).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBe(2)
})
