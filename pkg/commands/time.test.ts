import { newHttpClient } from "../test-utils"
import { it, expect } from "@jest/globals"
import { TimeCommand } from "./time"
const client = newHttpClient()

it("returns the time", async () => {
  const res = await new TimeCommand().exec(client)
  expect(res.error).toBeUndefined()
  expect(res.result).toBeDefined()
  expect(typeof typeof res.result![0]).toBe("number")
  expect(typeof typeof res.result![1]).toBe("number")
})
