import { newHttpClient } from "../test-utils"
import { describe, it, expect } from "@jest/globals"
import { FlushAllCommand } from "./flushall"
const client = newHttpClient()

describe("without options", () => {
  it("flushes the db", async () => {
    const res = await new FlushAllCommand([]).exec(client)
    expect(res).toBe("OK")
  })
})
describe("async", () => {
  it("flushes the db", async () => {
    const res = await new FlushAllCommand([{ async: true }]).exec(client)
    expect(res).toBe("OK")
  })
})
