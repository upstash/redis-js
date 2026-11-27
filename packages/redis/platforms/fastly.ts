import type { RequesterConfig, TokenProvider } from "../pkg/http";

import { HttpClient } from "../pkg/http";
import * as core from "../pkg/redis";
import { VERSION } from "../version";

export * as errors from "../pkg/error";
export type * from "../pkg/commands/types";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigFastly = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string | undefined;
  /**
   * UPSTASH_REDIS_REST_TOKEN, or a function returning a short-lived token. The function is
   * called before every HTTP request, so it should cache the token itself.
   */
  token: string | TokenProvider | undefined;
  /**
   * A Request can be forwarded to any backend defined on your service. Backends
   * can be created via the Fastly CLI, API, or web interface, and are
   * referenced by name.
   */
  backend: string;
  keepAlive?: boolean;

  /**
   * When this flag is enabled, any subsequent commands issued by this client are guaranteed to observe the effects of all earlier writes submitted by the same client.
   */
  readYourWrites?: boolean;
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
    if (!config.url) {
      console.warn(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config.`
      );
    } else if (config.url.startsWith(" ") || config.url.endsWith(" ") || /\r|\n/.test(config.url)) {
      console.warn(
        "[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!"
      );
    }

    const token = config.token;
    if (!token) {
      console.warn(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config.`
      );
    } else if (
      typeof token === "string" &&
      (token.startsWith(" ") || token.endsWith(" ") || /\r|\n/.test(token))
    ) {
      console.warn(
        "[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!"
      );
    }

    const client = new HttpClient({
      baseUrl: config.url!,
      retry: config.retry,
      headers: typeof token === "function" ? undefined : { authorization: `Bearer ${token}` },
      getToken: typeof token === "function" ? token : undefined,
      options: { backend: config.backend },
      responseEncoding: config.responseEncoding,
      keepAlive: config.keepAlive,
      readYourWrites: config.readYourWrites,
    });

    super(client, {
      automaticDeserialization: config.automaticDeserialization,
      enableAutoPipelining: config.enableAutoPipelining,
    });
    this.addTelemetry({
      sdk: `@upstash/redis@${VERSION}`,
      platform: "fastly",
    });

    if (this.enableAutoPipelining) {
      return this.autoPipeline();
    }
  }
}

export { type Requester, type UpstashRequest, type UpstashResponse } from "../pkg/http";
export { type Pipeline } from "../pkg/pipeline";
