import { BitCountCommand } from "./bitcount";
import { keygen, newHttpClient } from "../test-utils";
import { describe, it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  it("returns 0", async () => {
    const key = newKey()
    const res = await new BitCountCommand([key]).exec(client)
    expect(res).toEqual(0)
  })
})

describe("when key is set", () => {
  it("returns bitcount", async () => {
    const key = newKey()
    const value = "Hello World"
    await new SetCommand([key, value]).exec(client)
    const res = await new BitCountCommand([key]).exec(client)
    expect(res).toEqual(43)
  })

  describe("with start and end", () => {
    it("returns bitcount", async () => {
      const key = newKey()
      const value = "Hello World"
      await new SetCommand([key, value]).exec(client)
      const res = await new BitCountCommand([key, 4, 8]).exec(client)
      expect(res).toEqual(22)
    })
  })
})
