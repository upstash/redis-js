import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { MSetCommand } from "./mset"
import { MGetCommand } from "./mget"
import { SetCommand } from "./set"
import { GetCommand } from "./get"
import { MSetNXCommand } from "./msetnx"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("sets values", async () => {
  const key1 = newKey()
  const value1 = randomUUID()
  const key2 = newKey()
  const value2 = randomUUID()
  const res = await new MSetCommand(
    { key: key1, value: value1 },
    { key: key2, value: value2 },
  ).exec(client)

  expect(res).toEqual("OK")
  const res2 = await new MGetCommand(key1, key2).exec(client)

  expect(res2).toEqual([value1, value2])
})

it("does not set values if one key already exists", async () => {
  const key1 = newKey()
  const value1 = randomUUID()
  const key2 = newKey()
  const value2 = randomUUID()
  await new SetCommand(key1, value1).exec(client)
  const res = await new MSetNXCommand(
    { key: key1, value: value1 },
    { key: key2, value: value2 },
  ).exec(client)

  expect(res).toEqual(0)

  const res2 = await new GetCommand(key2).exec(client)

  expect(res2).toBeNull()
})
