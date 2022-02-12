import { HttpClient } from "./http"

import { expect, it } from "@jest/globals"
it("remove trailing slash from urls", () => {
  const client = new HttpClient({
    baseUrl: "https://example.com/",
  })

  expect(client.baseUrl).toBe("https://example.com")
})
