import { Context } from "netlify:edge";
import { Redis } from "https://deno.land/x/upstash_redis@v1.19.3/mod.ts";

const redis = Redis.fromEnv();
export default async (_req: Request, ctx: Context) => {
  ctx.log("Hello");
  try {
    return new Response(JSON.stringify({
      message: "Hello World",
      counter: await redis.incr("netlify-edge"),
    }));
  } catch (err) {
    ctx.log(err);
    return new Response(err.message, { status: 500 });
  }
};
