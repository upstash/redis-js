import { Redis } from "@upstash/redis/cloudflare";
import type { Bindings } from "bindings";

export default {
  async fetch(_request: Request, env: Bindings) {
    const redis = Redis.fromEnv(env);

    const count = await redis.incr("cloudflare-worker-count");

    return new Response(
      JSON.stringify({ count }),
    );
  },
};
