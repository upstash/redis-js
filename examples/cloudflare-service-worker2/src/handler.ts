import { Redis } from "@upstash/redis/cloudflare";

export async function handleRequest(request: Request): Promise<Response> {
  const redis = Redis.fromEnv();
  const count = await redis.incr("cloudflare_service_worker_counter");
  return new Response(JSON.stringify({ count }));
}
