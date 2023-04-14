import type { Context } from "https://edge.netlify.com";
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";

const redis = Redis.fromEnv();
export default async (_req: Request, _ctx: Context) => {
  console.log("Hello");
  try {
    return new Response(JSON.stringify({
      message: "Hello World",
      counter: await redis.incr("netlify-edge"),
    }));
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
};
