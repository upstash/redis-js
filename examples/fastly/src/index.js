import { Redis } from "@upstash/redis"

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)))

async function handleRequest(event) {
  const redis = new Redis({
    url: "<UPSTASH_REDIS_REST_URL>",
    token: "<UPSTASH_REDIS_REST_TOKEN>",
    requestOptions: { backend: "upstash-db" }, // same name you used in `fastly.toml`
  })

  const counter = await redis.incr("fastly")
  // Catch all other requests and return a 404.
  return new Response(`Counter: ${counter}`, {
    status: 404,
  })
}
