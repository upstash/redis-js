import { newHttpClient } from "../test-utils"
import { PublishCommand } from "./publish"
import { it, expect } from "@jest/globals"

const client = newHttpClient()

it("returns the ttl on a key", async () => {
  const res = await new PublishCommand("channel", "hello").exec(client)

  expect(res).toBeTruthy()
  expect(typeof res).toBe("number")
})
