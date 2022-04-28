/* global Request */

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const { incr } = Redis.fromEnv();

export default async function middleware(_request: Request) {
  const value = await incr("middleware_counter");
  console.log({ value });
  return NextResponse.next();
}
