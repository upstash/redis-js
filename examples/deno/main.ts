import { Redis } from "https://esm.sh/@upstash/redis@latest";

Deno.serve(async (_req: Request) => {
  const redis = Redis.fromEnv();
  const counter = await redis.incr("deno deploy counter");

  return new Response(JSON.stringify({ counter }), { status: 200 });
});
