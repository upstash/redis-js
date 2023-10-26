import { Redis } from "@upstash/redis/cloudflare";

export interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

export default {
  async fetch(_request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const redis = Redis.fromEnv(env);

    const count = await redis.incr("cloudflare-workers-with-typescript-count");

    return new Response(JSON.stringify({ count }));
  },
};
