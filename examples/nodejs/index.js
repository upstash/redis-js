import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function run() {
    const count = await redis.incr("counter");
    console.log("Counter:", count);
}

run();