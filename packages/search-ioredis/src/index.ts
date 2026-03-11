import type Redis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";
import { IoRedisRequester } from "./requester";

/**
 * Creates a Redis search client from an ioredis instance
 * @param redis - An ioredis instance
 * @returns A Redis search instance
 * @example
 * ```ts
 * import IORedis from "ioredis";
 * import { createSearch } from "@upstash/search-ioredis";
 * 
 * const ioredis = new IORedis(process.env.REDIS_URL);
 * const search = createSearch(ioredis);
 * ```
 */
export function createSearch(redis: Redis) {
  const ioRedisRequester = new IoRedisRequester(redis);
  const upstashRedis = new UpstashRedis(ioRedisRequester);
  return upstashRedis.search;
}
export { s } from "@upstash/redis";