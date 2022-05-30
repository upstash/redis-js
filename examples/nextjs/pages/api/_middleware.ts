/* global Request */

import { Redis } from "@upstash/redis/nodejs";
import { NextResponse } from "next/server";

const { incr } = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
export default async function middleware(_request: Request) {
  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = [
    "vercel",
    process.env.VERCEL_GIT_COMMIT_SHA,
    "middleware_counter",
  ].join("_");
  const value = await incr(key);
  console.log("mw", { value });
  return NextResponse.next();
}
