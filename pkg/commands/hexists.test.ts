import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { HSetCommand } from "./hset"
import { HExistsCommand } from "./hexists"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("returns 1 for an existing field", async () => {
  const key = newKey()
  const field = randomUUID()
  await new HSetCommand(key, { [field]: randomUUID() }).exec(client)
  const res = await new HExistsCommand(key, field).exec(client)
  expect(res).toEqual(1)
})
it("returns 0 if field does not exist", async () => {
  const key = newKey()
  await new HSetCommand(key, { [randomUUID()]: randomUUID() }).exec(client)

  const res = await new HExistsCommand(key, "not-existing-field").exec(client)
  expect(res).toEqual(0)
})
it("returns 0 if hash does not exist", async () => {
  const key = newKey()
  const field = randomUUID()
  const res = await new HExistsCommand(key, field).exec(client)
  expect(res).toEqual(0)
})
