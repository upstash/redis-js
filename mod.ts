import { HttpClient } from "./pkg/http.ts";
import * as core from "./pkg/redis.ts";
export type { Requester, UpstashRequest, UpstashResponse } from "./pkg/http";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigDeno = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string;
  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string;
} & core.RedisOptions;

/**
 * Serverless redis client for upstash.
 */
export class Redis extends core.Redis {
  /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(config: RedisConfigDeno) {
    const client = new HttpClient({
      baseUrl: config.url,
      headers: { authorization: `Bearer ${config.token}` },
    });

    super(client, {
      automaticDeserialization: config.automaticDeserialization,
    });
  }

  /*
   * Create a new Upstash Redis instance from environment variables on Deno.

   *
   */
  static fromEnv(opts?: core.RedisOptions): Redis {
    /**
     * These should be injected by Deno.
     */

    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`.",
      );
    }

    const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`.",
      );
    }
    return new Redis({ url, token, ...opts });
  }
}
