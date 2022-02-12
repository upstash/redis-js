import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { GetCommand } from "./get"
import { SetNxCommand } from "./setnx"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("sets value", async () => {
  const key = newKey()
  const value = randomUUID()
  const newValue = randomUUID()

  const res = await new SetCommand(key, value).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual("OK")
  const res2 = await new SetNxCommand(key, newValue).exec(client)
  expect(res2.error).not.toBeDefined()
  expect(res2.result).toEqual(0)
  const res3 = await new GetCommand(key).exec(client)
  expect(res3.error).not.toBeDefined()
  expect(res3.result).toEqual(value)
})
