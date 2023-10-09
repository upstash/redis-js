export const VERSION = "v0.0.0";
console.log({ VERSION, envs: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") });
