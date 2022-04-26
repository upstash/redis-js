/* global Response */

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const { incr } = new Redis({ url: "", token: "" });

export default async function middleware(request: Request) {
  // const value = await incr("middleware_cointer");

  const value = 2;
  console.log({ value });
  return NextResponse.next();
}
