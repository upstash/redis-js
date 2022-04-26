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
export type RedisConfigFastly = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string;
  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string;
  /**
   * A Request can be forwarded to any backend defined on your service. Backends
   * can be created via the Fastly CLI, API, or web interface, and are
   * referenced by name.
   */
  backend: string;
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
   *    const redis = new Redis({
   *        url: "<UPSTASH_REDIS_REST_URL>",
   *        token: "<UPSTASH_REDIS_REST_TOKEN>",
   *        backend: "upstash-db",
   *    });
   * ```
   */
  constructor(config: RedisConfigFastly) {
    const client = defaultRequester({
      baseUrl: config.url,
      headers: { authorization: `Bearer ${config.token}` },
      backend: config.backend,
    });

    super(client);
  }
}

function defaultRequester(config: {
  headers?: Record<string, string>;
  baseUrl: string;
  backend: string;
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
        // @ts-expect-error fastly requires `backend`
        backend: config.backend,
      });
      const body = (await res.json()) as UpstashResponse<TResult>;
      if (!res.ok) {
        throw new UpstashError(body.error!);
      }

      return body;
    },
  };
}
