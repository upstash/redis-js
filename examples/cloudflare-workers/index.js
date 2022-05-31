import { Redis } from "@upstash/redis/cloudflare";

export default {
  async fetch(_request, env) {
    const redis = Redis.fromEnv(env);

    const count = await redis.incr("cloudflare-worker-wrangler2-count");

    return new Response(
      JSON.stringify({ count }),
    );
  },
};
