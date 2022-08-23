import { Context } from "netlify:edge";
import { Redis } from "https://deno.land/x/upstash_redis@v1.12.0-rc.1/mod.ts";

const redis = Redis.fromEnv();
export default async (_req: Request, ctx: Context) => {
  ctx.log("Hello");

  return new Response(JSON.stringify({
    message: "Hello World",
    counter: await redis.incr("netlify-edge"),
  }));
};
