import { Redis } from "@upstash/redis/cloudflare";

export default {
  async fetch(_request, env) {
    const redis = Redis.fromEnv(env);

    const count = await redis.incr("cloudflare-workers-count");

    return new Response(JSON.stringify({ count }));
  },
};
