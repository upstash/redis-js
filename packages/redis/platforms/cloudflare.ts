import type { HttpClientConfig, RequesterConfig } from "../pkg/http";
import { HttpClient } from "../pkg/http";
import * as core from "../pkg/redis";
import { VERSION } from "../version";

type Env = {
  UPSTASH_DISABLE_TELEMETRY?: string;
};

export * as errors from "../pkg/error";
export type * from "../pkg/commands/types";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigCloudflare = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string | undefined;
  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string | undefined;
  /**
   * The signal will allow aborting requests on the fly.
   * For more check: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: HttpClientConfig["signal"];
  keepAlive?: boolean;

  /**
   * When this flag is enabled, any subsequent commands issued by this client are guaranteed to observe the effects of all earlier writes submitted by the same client.
   */
  readYourWrites?: boolean;
} & core.RedisOptions &
  RequesterConfig &
  Env;

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
  constructor(config: RedisConfigCloudflare, env?: Env) {
    if (!config.url) {
      console.warn(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis`
      );
    } else if (config.url.startsWith(" ") || config.url.endsWith(" ") || /\r|\n/.test(config.url)) {
      console.warn(
        "[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!"
      );
    }

    if (!config.token) {
      console.warn(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis`
      );
    } else if (
      config.token.startsWith(" ") ||
      config.token.endsWith(" ") ||
      /\r|\n/.test(config.token!)
    ) {
      console.warn(
        "[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!"
      );
    }

    const client = new HttpClient({
      retry: config.retry,
      baseUrl: config.url!,
      headers: { authorization: `Bearer ${config.token}` },
      responseEncoding: config.responseEncoding,
      signal: config.signal,
      keepAlive: config.keepAlive,
      readYourWrites: config.readYourWrites,
    });

    super(client, {
      enableTelemetry: config.enableTelemetry ?? !env?.UPSTASH_DISABLE_TELEMETRY,
      automaticDeserialization: config.automaticDeserialization,
      latencyLogging: config.latencyLogging,
      enableAutoPipelining: config.enableAutoPipelining,
    });
    // This is only added of the user has not disabled telemetry
    this.addTelemetry({
      platform: "cloudflare",
      sdk: `@upstash/redis@${VERSION}`,
    });

    if (this.enableAutoPipelining) {
      return this.autoPipeline();
    }
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
      UPSTASH_DISABLE_TELEMETRY?: string;
    },
    opts?: Omit<RedisConfigCloudflare, "url" | "token">
  ): Redis {
    const url =
      env?.UPSTASH_REDIS_REST_URL ??
      // @ts-expect-error These will be defined by cloudflare
      (typeof UPSTASH_REDIS_REST_URL === "string"
        ? // @ts-expect-error These will be defined by cloudflare
          UPSTASH_REDIS_REST_URL
        : undefined);

    const token =
      env?.UPSTASH_REDIS_REST_TOKEN ??
      // @ts-expect-error These will be defined by cloudflare
      (typeof UPSTASH_REDIS_REST_TOKEN === "string"
        ? // @ts-expect-error These will be defined by cloudflare
          UPSTASH_REDIS_REST_TOKEN
        : undefined);

    const missing: string[] = [];
    if (!url) missing.push("UPSTASH_REDIS_REST_URL");
    if (!token) missing.push("UPSTASH_REDIS_REST_TOKEN");

    if (missing.length > 0) {
      // Both can be missing at once, so the wording and the number of
      // `wrangler secret put` commands follow how many are actually missing.
      const plural = missing.length > 1;
      const names = missing.map((name) => `\`${name}\``).join(" and ");
      const commands = missing.map((name) => `\`wrangler secret put ${name}\``).join(" and ");
      console.warn(
        `[Upstash Redis] Unable to find environment variable${plural ? "s" : ""}: ${names}. Please add ${plural ? "them" : "it"} via ${commands} and provide ${plural ? "them as arguments" : "it as an argument"} to the \`Redis.fromEnv\` function. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis`
      );
    }
    return new Redis({ ...opts, url, token }, env);
  }
}

export { type Requester, type UpstashRequest, type UpstashResponse } from "../pkg/http";
export { type Pipeline } from "../pkg/pipeline";
