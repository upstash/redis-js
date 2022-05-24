import { Redis } from "@upstash/redis/fastly";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(_event) {
  const redis = new Redis({
    url: "<UPSTASH_REDIS_REST_URL>",
    token: "<UPSTASH_REDIS_REST_TOKEN>",
    backend: "upstash-db", // same name you used in `fastly.toml`
  });

  const count = await redis.incr("fastly");
  return new Response(JSON.stringify(({ count })))
}