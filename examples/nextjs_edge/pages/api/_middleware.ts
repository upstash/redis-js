import type { NextFetchEvent, NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

/**
 * We're prefixing the key for our automated tests.
 * This is to avoid collisions with other tests.
 */
const key = [
  "vercel",
  process.env.VERCEL_GIT_COMMIT_SHA,
  "nextjs_middleware",
].join("_");

export default async function middleware(
  _request: NextRequest,
  _event: NextFetchEvent,
): Promise<Response | undefined> {
  const start = Date.now();

  const counter = await redis.incr(key);
  console.log("Middleware", counter);
  return new Response(
    JSON.stringify({ counter, latency: Date.now() - start }),
    {
      status: 200,
    },
  );
}
