import { Redis } from "@upstash/redis/cloudflare";

export async function handleRequest(request: Request): Promise<Response> {
  const redis = Redis.fromEnv();
  return new Response(JSON.stringify({ count: 2 }));
}
