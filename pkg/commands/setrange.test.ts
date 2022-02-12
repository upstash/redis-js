import { keygen, newHttpClient } from "../test-utils"
import { it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { SetRangeCommand } from "./setrange"
import { GetCommand } from "./get"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("sets value", async () => {
  const key = newKey()
  const value = "originalValue"

  const res = await new SetCommand(key, value).exec(client)
  expect(res.error).not.toBeDefined()
  expect(res.result).toEqual("OK")
  const res2 = await new SetRangeCommand(key, 4, "helloWorld").exec(client)
  expect(res2.error).not.toBeDefined()
  expect(res2.result).toEqual(14)
  const res3 = await new GetCommand(key).exec(client)
  expect(res3.error).not.toBeDefined()
  expect(res3.result).toEqual("orighelloWorld")
})
