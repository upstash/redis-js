import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
import { SetCommand } from "./set"
import { RenameNXCommand } from "./renamenx"
const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterAll(cleanup)

describe("when the key exists", () => {
  it("does nothing", async () => {
    const source = newKey()
    const destination = newKey()
    const sourceValue = randomUUID()
    const destinationValue = randomUUID()
    await new SetCommand(source, sourceValue).exec(client)
    await new SetCommand(destination, destinationValue).exec(client)
    const res = await new RenameNXCommand(source, destination).exec(client)
    expect(res).toBe(0)
  })
})
describe("when the key does not exist", () => {
  it("renames the key", async () => {
    const source = newKey()
    const destination = newKey()
    const value = randomUUID()
    await new SetCommand(source, value).exec(client)
    const res = await new RenameNXCommand(source, destination).exec(client)
    expect(res).toBe(1)
  })
})
