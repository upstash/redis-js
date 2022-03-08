import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SetExCommand } from "./setex"
import { GetCommand } from "./get"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)
it("sets value", async () => {
  const key = newKey()
  const value = randomUUID()

  const res = await new SetExCommand(key, 1, value).exec(client)

  expect(res).toEqual("OK")
  await new Promise((res) => setTimeout(res, 2000))
  const res2 = await new GetCommand(key).exec(client)

  expect(res2).toBeNull()
})
