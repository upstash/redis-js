import { HttpClient } from "./http";
import * as core from "./redis";

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
};

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

    super(client);
  }

  /*
   * Create a new Upstash Redis instance from environment variables on Deno.

   *
   */
  static fromEnv(): Redis {
    /**
     * These should be injected by Deno.
     */

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const token = DENO.env.get("UPSTASH_REDIS_REST_TOKEN");

    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`.",
      );
    }
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`.",
      );
    }
    return new Redis({ url, token });
  }
}
