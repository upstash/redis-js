import * as core from "../pkg/redis.ts";
import type {
  Requester,
  UpstashRequest,
  UpstashResponse,
} from "../pkg/http.ts";
import { UpstashError } from "../pkg/error.ts";

export type { Requester, UpstashRequest, UpstashResponse };
/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigCloudflare = {
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
  constructor(config: RedisConfigCloudflare) {
    const client = defaultRequester({
      baseUrl: config.url,
      headers: { authorization: `Bearer ${config.token}` },
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
   *
   */
  static fromEnv(env?: {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }): Redis {
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
    return new Redis({ url, token });
  }
}

function defaultRequester(config: {
  headers?: Record<string, string>;
  baseUrl: string;
}): Requester {
  return {
    request: async function <TResult>(
      req: UpstashRequest,
    ): Promise<UpstashResponse<TResult>> {
      if (!req.path) {
        req.path = [];
      }

      const res = await fetch([config.baseUrl, ...req.path].join("/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...config.headers },
        body: JSON.stringify(req.body),
        keepalive: true,
      });
      const body = (await res.json()) as UpstashResponse<TResult>;
      if (!res.ok) {
        throw new UpstashError(body.error!);
      }

      return body;
    },
  };
}
