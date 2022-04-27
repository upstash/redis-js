import { Redis } from "@upstash/redis";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const redis = Redis.fromEnv();
  const count = await redis.incr("cloudflare_service_worker_counter");
  return new Response(JSON.stringify({ count: 2 }), {
    headers: { "content-type": "application/json" },
  });
}
