import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HMSetCommand } from "./hmset"
import { HMGetCommand } from "./hmget"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("gets exiting values", async () => {
  const key = newKey()
  const kv = {
    [randomUUID()]: randomUUID(),
    [randomUUID()]: randomUUID(),
  }
  const res = await new HMSetCommand([key, kv]).exec(client)

  expect(res).toEqual("OK")
  const res2 = await new HMGetCommand([key, ...Object.keys(kv)]).exec(client)

  expect(res2).toEqual(kv)
})
