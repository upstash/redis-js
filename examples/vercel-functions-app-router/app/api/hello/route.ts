import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
    const count = await redis.incr("counter");
    return NextResponse.json({ count });
}

export const dynamic = 'force-dynamic'
