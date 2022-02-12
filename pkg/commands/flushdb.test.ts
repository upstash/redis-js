import { newHttpClient } from "../test-utils"
import { describe, it, expect } from "@jest/globals"
import { FlushDBCommand } from "./flushdb"
const client = newHttpClient()

describe("without options", () => {
  it("flushes the db", async () => {
    const res = await new FlushDBCommand().exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe("OK")
  })
})
describe("async", () => {
  it("flushes the db", async () => {
    const res = await new FlushDBCommand({ async: true }).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe("OK")
  })
})
