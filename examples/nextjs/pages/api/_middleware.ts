/* global Request */

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export default async function middleware(_request: Request) {
  console.log("env: ", JSON.stringify(process.env, null, 2));

  const { incr } = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
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
  console.log({ value });
  return NextResponse.next();
}
