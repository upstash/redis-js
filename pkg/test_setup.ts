import { HttpClient } from "./http"
import { config } from "dotenv"
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
