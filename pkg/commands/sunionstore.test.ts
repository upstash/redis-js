import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { SAddCommand } from "./sadd"
import { SUnionStoreCommand } from "./sunionstore"
import { SMembersCommand } from "./smembers"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("writes the union to destination", async () => {
  const key1 = newKey()
  const key2 = newKey()
  const dest = newKey()

  const member1 = randomUUID()
  const member2 = randomUUID()

  await new SAddCommand([key1, member1]).exec(client)
  await new SAddCommand([key2, member2]).exec(client)
  const res = await new SUnionStoreCommand([dest, key1, key2]).exec(client)
  expect(res).toBe(2)

  const res2 = await new SMembersCommand([dest]).exec(client)

  expect(res2).toBeDefined()
  expect(res2!.sort()).toEqual([member1, member2].sort())
})
