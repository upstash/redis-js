/* eslint-disable @typescript-eslint/ban-ts-comment */
// deno-lint-ignore-file

import type { HttpClientConfig, Requester, RequesterConfig } from "../pkg/http";
import { HttpClient } from "../pkg/http";

import * as core from "../pkg/redis";
import { VERSION } from "../version";

/**
 * Workaround for nodejs 14, where atob is not included in the standardlib
 */
if (typeof atob === "undefined") {
  global.atob = (b64: string) => Buffer.from(b64, "base64").toString("utf8");
}
export * as errors from "../pkg/error";
export type * from "../pkg/commands/types";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigNodejs = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string | undefined;
  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string | undefined;

  /**
   * An agent allows you to reuse connections to reduce latency for multiple sequential requests.
   *
   * This is a node specific implementation and is not supported in various runtimes like Vercel
   * edge functions.
   *
   * @example
   * ```ts
   * import https from "https"
   *
   * const options: RedisConfigNodejs = {
   *  agent: new https.Agent({ keepAlive: true })
   * }
   * ```
   */
  /**
   * The signal will allow aborting requests on the fly.
   * For more check: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: HttpClientConfig["signal"];
  latencyLogging?: boolean;
  agent?: unknown;
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
   * Create a new redis client by providing the url and token
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(config: RedisConfigNodejs);

  /**
   * Create a new redis client by providing a custom `Requester` implementation
   *
   * @example
   * ```ts
   *
   * import { UpstashRequest, Requester, UpstashResponse, Redis } from "@upstash/redis"
   *
   *  const requester: Requester = {
   *    request: <TResult>(req: UpstashRequest): Promise<UpstashResponse<TResult>> => {
   *      // ...
   *    }
   *  }
   *
   * const redis = new Redis(requester)
   * ```
   */
  constructor(configOrRequester: RedisConfigNodejs | Requester) {
    if ("request" in configOrRequester) {
      super(configOrRequester);
      return;
    }

    if (!configOrRequester.url) {
      console.warn(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config.`
      );
    } else if (
      configOrRequester.url.startsWith(" ") ||
      configOrRequester.url.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.url)
    ) {
      console.warn(
        "[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!"
      );
    }

    if (!configOrRequester.token) {
      console.warn(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config.`
      );
    } else if (
      configOrRequester.token.startsWith(" ") ||
      configOrRequester.token.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.token)
    ) {
      console.warn(
        "[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!"
      );
    }

    const client = new HttpClient({
      baseUrl: configOrRequester.url!,
      retry: configOrRequester.retry,
      headers: { authorization: `Bearer ${configOrRequester.token}` },

      agent: configOrRequester.agent,
      responseEncoding: configOrRequester.responseEncoding,
      cache: configOrRequester.cache ?? "no-store",
      signal: configOrRequester.signal,
      keepAlive: configOrRequester.keepAlive,
      readYourWrites: configOrRequester.readYourWrites,
    });

    super(client, {
      automaticDeserialization: configOrRequester.automaticDeserialization,
      enableTelemetry: !process.env.UPSTASH_DISABLE_TELEMETRY,
      latencyLogging: configOrRequester.latencyLogging,
      enableAutoPipelining: configOrRequester.enableAutoPipelining,
    });

    this.addTelemetry({
      runtime:
        // @ts-expect-error to silence compiler
        typeof EdgeRuntime === "string" ? "edge-light" : `node@${process.version}`,
      platform: process.env.UPSTASH_CONSOLE
        ? "console"
        : process.env.VERCEL
          ? "vercel"
          : process.env.AWS_REGION
            ? "aws"
            : "unknown",
      sdk: `@upstash/redis@${VERSION}`,
    });

    if (this.enableAutoPipelining) {
      return this.autoPipeline();
    }
  }

  /**
   * Create a new Upstash Redis instance from environment variables.
   *
   * Use this to automatically load connection secrets from your environment
   * variables. For instance when using the Vercel integration.
   *
   * This tries to load connection details from your environment using `process.env`:
   * - URL: `UPSTASH_REDIS_REST_URL` or fallback to `KV_REST_API_URL`
   * - Token: `UPSTASH_REDIS_REST_TOKEN` or fallback to `KV_REST_API_TOKEN`
   *
   * The fallback variables provide compatibility with Vercel KV and other platforms
   * that may use different naming conventions.
   */
  static fromEnv(config?: Omit<RedisConfigNodejs, "url" | "token">): Redis {
    // @ts-ignore process will be defined in node

    if (process.env === undefined) {
      throw new TypeError(
        '[Upstash Redis] Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead'
      );
    }

    // @ts-ignore process will be defined in node
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    if (!url) {
      console.warn("[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_URL`");
    }

    // @ts-ignore process will be defined in node
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!token) {
      console.warn(
        "[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`"
      );
    }
    return new Redis({ ...config, url, token });
  }
}

export { type Pipeline } from "../pkg/pipeline";
export { type UpstashRequest, type UpstashResponse, type Requester } from "../pkg/http";
