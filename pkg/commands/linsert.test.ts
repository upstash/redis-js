import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { LInsertCommand } from "./linsert"
import { LPushCommand } from "./lpush"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("adds the element", async () => {
  const key = newKey()
  const value1 = randomUUID()
  const value2 = randomUUID()

  await new LPushCommand(key, value1).exec(client)
  const res = await new LInsertCommand(key, "before", value1, value2).exec(client)
  expect(res).toBe(2)
})
