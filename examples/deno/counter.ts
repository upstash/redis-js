import { Redis } from "../../mod.ts";

const redis = Redis.fromEnv();
console.log(await redis.incr("deno counter"));
