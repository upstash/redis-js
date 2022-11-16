import * as core from "../pkg/redis.ts";
import type {
  Requester,
  UpstashRequest,
  UpstashResponse,
} from "../pkg/http.ts";
import { HttpClient, RequesterConfig } from "../pkg/http.ts";

export type { Requester, UpstashRequest, UpstashResponse };
/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigCloudflare =
  & {
    /**
     * UPSTASH_REDIS_REST_URL
     */
    url: string;
    /**
     * UPSTASH_REDIS_REST_TOKEN
     */
    token: string;
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
  constructor(config: RedisConfigCloudflare) {
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
   * Create a new Upstash Redis instance from environment variables on cloudflare.
   *
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * the global namespace
   *
   * If you are using a module worker, please pass in the `env` object.
   * ```ts
   * const redis = Redis.fromEnv(env)
   * ```
   */
  static fromEnv(
    env?: {
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
    },
    opts?: Omit<RedisConfigCloudflare, "url" | "token">,
  ): Redis {
    // @ts-ignore These will be defined by cloudflare
    const url = env?.UPSTASH_REDIS_REST_URL ?? UPSTASH_REDIS_REST_URL;

    // @ts-ignore These will be defined by cloudflare
    const token = env?.UPSTASH_REDIS_REST_TOKEN ?? UPSTASH_REDIS_REST_TOKEN;

    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`. Please add it via `wrangler secret put UPSTASH_REDIS_REST_URL`",
      );
    }
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`. Please add it via `wrangler secret put UPSTASH_REDIS_REST_TOKEN`",
      );
    }
    return new Redis({ ...opts, url, token });
  }
}
