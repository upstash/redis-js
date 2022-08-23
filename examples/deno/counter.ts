import { Redis } from "https://deno.land/x/upstash_redis@v1.12.0-rc.1/mod.ts";

const redis = Redis.fromEnv();
console.log(await redis.incr("deno counter"));
