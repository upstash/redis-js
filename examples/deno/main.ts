import { serve } from "https://deno.land/std@0.177.0/http/server";
import { Redis } from "https://deno.land/x/upstash_redis/mod";

serve(async (_req: Request) => {
  const redis = Redis.fromEnv();
  const counter = await redis.incr("deno deploy counter");

  return new Response(JSON.stringify({ counter }), { status: 200 });
});
