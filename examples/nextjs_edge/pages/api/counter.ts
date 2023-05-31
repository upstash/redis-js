import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

const redis = Redis.fromEnv();

export default async (_req: NextRequest) => {
  const counter = await redis.incr("vercel_edge_counter");
  return NextResponse.json({ counter });
};
