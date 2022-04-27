// import { Redis } from "@upstash/redis";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response(JSON.stringify({ count: 2 }), {
    headers: { "content-type": "application/json" },
  });
}
