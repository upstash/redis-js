import { HttpClient } from "./http"

import { expect, test } from "@jest/globals"
test("remove trailing slash from urls", () => {
  const client = new HttpClient({
    baseUrl: "https://example.com/",
  })

  expect(client.baseUrl).toBe("https://example.com")
})
