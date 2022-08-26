// deno-lint-ignore-file

import * as core from "../pkg/redis.ts";
import {
  HttpClient,
  Requester,
  RetryConfig,
  UpstashRequest,
  UpstashResponse,
} from "../pkg/http.ts";
// @ts-ignore Deno can't compile
// import https from "https";
// @ts-ignore Deno can't compile
// import http from "http";
// import "isomorphic-fetch";

export type { Requester, UpstashRequest, UpstashResponse };

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigNodejs = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string;
  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string;
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
  // agent?: http.Agent | https.Agent;

  /**
   * Configure the retry behaviour in case of network errors
   */
  retry?: RetryConfig;
} & core.RedisOptions;

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
    if (
      configOrRequester.url.startsWith(" ") ||
      configOrRequester.url.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.url)
    ) {
      console.warn(
        "The redis url contains whitespace or newline, which can cause errors!",
      );
    }
    if (
      configOrRequester.token.startsWith(" ") ||
      configOrRequester.token.endsWith(" ") ||
      /\r|\n/.test(configOrRequester.token)
    ) {
      console.warn(
        "The redis token contains whitespace or newline, which can cause errors!",
      );
    }

    const client = new HttpClient({
      baseUrl: configOrRequester.url,
      retry: configOrRequester.retry,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
      // agent: configOrRequester.agent,
    });

    super(client, {
      automaticDeserialization: configOrRequester.automaticDeserialization,
    });
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
    let url: string | undefined = undefined;
    let token: string | undefined = undefined;
    // @ts-ignore process will be defined in node
    if (typeof process !== "undefined") {
      // @ts-ignore process will be defined in node
      url = process?.env["UPSTASH_REDIS_REST_URL"];
      // @ts-ignore process will be defined in node
      token = process?.env["UPSTASH_REDIS_REST_TOKEN"];
    }

    // fallback for Vite https://vitejs.dev/guide/env-and-mode.html
    if (!url) {
      url = (import.meta as any).env["VITE_UPSTASH_REDIS_REST_URL"];
    }
    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`",
      );
    }
    // fallback for Vite https://vitejs.dev/guide/env-and-mode.html
    if (!token) {
      token = (import.meta as any).env.VITE_UPSTASH_REDIS_REST_TOKEN;
    }
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`",
      );
    }

    return new Redis({ ...config, url, token });
  }
}
