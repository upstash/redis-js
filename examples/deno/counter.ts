import { Redis } from "https://deno.land/x/upstash_redis@v1.11.0/mod.ts";

const redis = Redis.fromEnv();
console.log(await redis.incr("deno counter"));
