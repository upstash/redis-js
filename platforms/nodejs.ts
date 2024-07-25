// deno-lint-ignore-file

import {
  HttpClient,
  Requester,
  RequesterConfig,
  UpstashRequest,
  UpstashResponse,
} from "../pkg/http";
import { Pipeline } from "../pkg/pipeline";
import * as core from "../pkg/redis";
import { VERSION } from "../version";

/**
 * Workaround for nodejs 14, where atob is not included in the standardlib
 */
if (typeof atob === "undefined") {
  global.atob = (b64: string) => Buffer.from(b64, "base64").toString("utf-8");
}
export * as errors from "../pkg/error";
export type * from "../pkg/commands/types";
export type { Requester, UpstashRequest, UpstashResponse, Pipeline };

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
  signal?: AbortSignal;
  latencyLogging?: boolean;
  agent?: any;
  keepAlive?: boolean;
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
  constructor(requesters: Requester);
  constructor(configOrRequester: RedisConfigNodejs | Requester) {
    if ("request" in configOrRequester) {
      super(configOrRequester);
      return;
    }

    if (!configOrRequester.url) {
      throw new Error(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config.`
      );
    }

    if (!configOrRequester.token) {
      throw new Error(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config.`
      );
    }

    if (
      configOrRequester.url.startsWith(" ") ||
      configOrRequester.url.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.url)
    ) {
      console.warn("The redis url contains whitespace or newline, which can cause errors!");
    }
    if (
      configOrRequester.token.startsWith(" ") ||
      configOrRequester.token.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.token)
    ) {
      console.warn("The redis token contains whitespace or newline, which can cause errors!");
    }

    const client = new HttpClient({
      baseUrl: configOrRequester.url,
      retry: configOrRequester.retry,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
      agent: configOrRequester.agent,
      responseEncoding: configOrRequester.responseEncoding,
      cache: configOrRequester.cache || "no-store",
      signal: configOrRequester.signal,
      keepAlive: configOrRequester.keepAlive,
    });

    super(client, {
      automaticDeserialization: configOrRequester.automaticDeserialization,
      enableTelemetry: !process.env.UPSTASH_DISABLE_TELEMETRY,
      latencyLogging: configOrRequester.latencyLogging,
      enableAutoPipelining: configOrRequester.enableAutoPipelining,
    });

    this.addTelemetry({
      runtime:
        // @ts-ignore
        typeof EdgeRuntime === "string" ? "edge-light" : `node@${process.version}`,
      platform: process.env.VERCEL ? "vercel" : process.env.AWS_REGION ? "aws" : "unknown",
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
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * your environment using `process.env`.
   */
  static fromEnv(config?: Omit<RedisConfigNodejs, "url" | "token">): Redis {
    // @ts-ignore process will be defined in node
    if (typeof process?.env === "undefined") {
      throw new Error(
        'Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead'
      );
    }
    // @ts-ignore process will be defined in node
    const url = process?.env.UPSTASH_REDIS_REST_URL;
    if (!url) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_URL`");
    }
    // @ts-ignore process will be defined in node
    const token = process?.env.UPSTASH_REDIS_REST_TOKEN;
    if (!token) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`");
    }
    return new Redis({ ...config, url, token });
  }
}
