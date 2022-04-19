import { EvalCommand } from "./eval"
import { keygen, newHttpClient } from "../test-utils"
import { randomUUID } from "crypto"
import { describe, it, expect, afterAll } from "@jest/globals"
const client = newHttpClient()

const { cleanup } = keygen()
afterAll(cleanup)

describe("simple", () => {
  it("returns something", async () => {
    const value = randomUUID()
    const res = await new EvalCommand("return ARGV[1]", 0, value).exec(client)
    expect(res).toEqual(value)
  })
})
