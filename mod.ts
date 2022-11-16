import { HttpClient, RequesterConfig, RetryConfig } from "./pkg/http.ts";
import * as core from "./pkg/redis.ts";
export type { Requester, UpstashRequest, UpstashResponse } from "./pkg/http.ts";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigDeno =
  & {
    /**
     * UPSTASH_REDIS_REST_URL
     */
    url: string;
    /**
     * UPSTASH_REDIS_REST_TOKEN
     */
    token: string;

    /**
     * Configure the retry behaviour in case of network errors
     *
     * Set false to disable retries
     */
    retry?: RetryConfig;
  }
  & core.RedisOptions
  & RequesterConfig;

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
    if (
      config.url.startsWith(" ") ||
      config.url.endsWith(" ") ||
      /\r|\n/.test(config.url)
    ) {
      console.warn(
        "The redis url contains whitespace or newline, which can cause errors!",
      );
    }
    if (
      config.token.startsWith(" ") ||
      config.token.endsWith(" ") ||
      /\r|\n/.test(config.token)
    ) {
      console.warn(
        "The redis token contains whitespace or newline, which can cause errors!",
      );
    }

    const client = new HttpClient({
      retry: config.retry,
      baseUrl: config.url,
      headers: { authorization: `Bearer ${config.token}` },
      responseEncoding: config.responseEncoding,
    });

    super(client, {
      automaticDeserialization: config.automaticDeserialization,
    });
  }

  /*
   * Create a new Upstash Redis instance from environment variables on Deno.

   *
   */
  static fromEnv(opts?: Omit<RedisConfigDeno, "url" | "token">): Redis {
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
    return new Redis({ ...opts, url, token });
  }
}
