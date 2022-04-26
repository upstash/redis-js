/* global Response */

import { Redis } from "@upstash/redis/nodejs";
import { NextResponse } from "next/server";

const { incr } = Redis.fromEnv();

export default async function middleware(request: Request) {
  const value = await incr("middleware_counter");
  console.log({ value });
  return NextResponse.next();
}
