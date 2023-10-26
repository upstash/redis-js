import type { Requester, RequesterConfig, UpstashRequest, UpstashResponse } from "../pkg/http";
import { HttpClient } from "../pkg/http";
import * as core from "../pkg/redis";
import { VERSION } from "../version";

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
} & core.RedisOptions &
  RequesterConfig;

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
    if (config.url.startsWith(" ") || config.url.endsWith(" ") || /\r|\n/.test(config.url)) {
      console.warn("The redis url contains whitespace or newline, which can cause errors!");
    }
    if (config.token.startsWith(" ") || config.token.endsWith(" ") || /\r|\n/.test(config.token)) {
      console.warn("The redis token contains whitespace or newline, which can cause errors!");
    }

    const client = new HttpClient({
      baseUrl: config.url,
      retry: config.retry,
      headers: { authorization: `Bearer ${config.token}` },
      options: { backend: config.backend },
      responseEncoding: config.responseEncoding,
    });

    super(client, {
      automaticDeserialization: config.automaticDeserialization,
    });
    this.addTelemetry({
      sdk: `@upstash/redis@${VERSION}`,
      platform: "fastly",
    });
  }
}
