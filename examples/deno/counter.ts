import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";

const redis = Redis.fromEnv();
console.log(await redis.incr("deno counter"));
