import { Redis, Requester, UpstashResponse } from "@upstash/redis";

/**
 * it's possible to create a Redis client with a custom requester
 * implementation. This can be useful if you want to modify the
 * request/response behavior, add custom logging, or integrate with
 * other libraries.
 * 
 * In this example, we create a simple custom requester that logs
 * the request options and returns a mock response.
 */

const requester = {
  request: async (opts) => {
    console.log("Custom requester called with:", opts);
    return { result: "custom response" } as UpstashResponse<any>;
  },
} satisfies Requester

const redis = new Redis(requester)

export async function GET() {
  const response = await redis.get("mykey");
  return new Response(JSON.stringify({ response }));
}