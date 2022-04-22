/* global Response */

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const { incr } = Redis.fromEnv();

export default async function middleware(request: Request) {
  const value = await incr("middleware_cointer");
  console.log({ value });
  return NextResponse.next();
}
