import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { it, expect, afterAll } from "@jest/globals"
import { MSetCommand } from "./mset"
import { UnlinkCommand } from "./unlink"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

it("unlinks the keys", async () => {
  const key1 = newKey()
  const key2 = newKey()
  const key3 = newKey()
  await new MSetCommand(
    { key: key1, value: randomUUID() },
    { key: key2, value: randomUUID() },
  ).exec(client)
  const res = await new UnlinkCommand(key1, key2, key3).exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toEqual(2)
})
