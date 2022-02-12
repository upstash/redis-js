import { HttpClient } from "./http"
import { config } from "dotenv"
import { randomUUID } from "crypto"
import { DelCommand } from "./commands/del"
config()

export const newHttpClient = () => {
  const url = process.env["UPSTASH_REDIS_REST_URL"]
  if (!url) {
    throw new Error("Could not find url")
  }
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"]
  if (!token) {
    throw new Error("Could not find token")
  }

  return new HttpClient({
    baseUrl: url,
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}

export function keygen(): { newKey: () => string; cleanup: () => Promise<void> } {
  const keys: string[] = []
  return {
    newKey: () => {
      const key = randomUUID()
      keys.push(key)
      return key
    },
    cleanup: async () => {
      await new DelCommand(...keys).exec(newHttpClient())
    },
  }
}
