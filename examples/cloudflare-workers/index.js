import { Redis } from "@upstash/redis/cloudflare"

const redis = Redis.fromEnv()

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname !== "/") {
    return new Response()
  }

  const count = await redis.incr("workers-count")

  return new Response(html(count), {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  })
}

const html = (count) => `
  <h1>Cloudflare Workers with Upstash Redis</h1>
  <h2>Count: ${count}</h2>
`
