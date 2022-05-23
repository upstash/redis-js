import { Redis } from "@upstash/redis/cloudflare";
import type { Bindings } from "bindings";

export default {
  async fetch(request: Request, env: Bindings) {
    const url = new URL(request.url);
    console.log({ url });
    const redis = Redis.fromEnv(env);

    const count = await redis.incr("cloudflare-worker-count");

    return new Response(
      `<h1>Cloudflare Workers with Upstash Redis</h1><h2>Count: ${count}</h2>`,
    );
  },
};
