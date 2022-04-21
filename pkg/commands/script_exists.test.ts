import { newHttpClient } from "../test-utils"
import { it, expect, describe } from "@jest/globals"
import { ScriptLoadCommand } from "./script_load"
import { ScriptExistsCommand } from "./script_exists"
import { randomUUID } from "crypto"
const client = newHttpClient()

describe("with a single script", () => {
  describe("when the script exists", () => {
    it("returns 1", async () => {
      const script = `return "${randomUUID()}"`
      const hash = await new ScriptLoadCommand(script).exec(client)
      const res = await new ScriptExistsCommand(hash).exec(client)
      expect(res).toEqual(1)
    })
  })
  describe("when the script does not exist", () => {
    it("returns 0", async () => {
      const res = await new ScriptExistsCommand("21").exec(client)
      expect(res).toEqual(0)
    })
  })
})
describe("with multiple scripts", () => {
  it("returns the found scripts", async () => {
    const script1 = `return "${randomUUID()}"`
    const script2 = `return "${randomUUID()}"`
    const hash1 = await new ScriptLoadCommand(script1).exec(client)
    const hash2 = await new ScriptLoadCommand(script2).exec(client)
    const res = await new ScriptExistsCommand(hash1, hash2).exec(client)
    expect(res).toEqual([1, 1])
  })
})
