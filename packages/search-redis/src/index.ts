import { Redis as UpstashRedis } from "@upstash/redis";
import { NodeRedisRequester } from "./requester";

/**
 * Creates a Redis search client from a node-redis instance
 * @param client - A node-redis client instance
 * @returns A Redis search instance
 * @example
 * ```ts
 * import { createClient } from "redis";
 * import { createSearch } from "@upstash/search-redis";
 * 
 * const client = createClient({ url: process.env.REDIS_URL });
 * await client.connect();
 * 
 * const search = createSearch(client);
 * ```
 */
export function createSearch(client: any) {
  const nodeRedisRequester = new NodeRedisRequester(client);
  const upstashRedis = new UpstashRedis(nodeRedisRequester);
  return upstashRedis.search;
}
export { s } from "@upstash/redis";