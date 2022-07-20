import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
export default async function middleware(
  _request: NextRequest,
  _event: NextFetchEvent,
): Promise<Response | undefined> {
  const start = Date.now();

  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA, "nextjs_middleware"]
    .join("_");

  const counter = await redis.incr(key);

  console.log("Middleware", counter);
  const res = NextResponse.next();
  res.headers.set("Counter", counter.toString());
  res.headers.set("Latency", (Date.now() - start).toString());

  return res;
}
