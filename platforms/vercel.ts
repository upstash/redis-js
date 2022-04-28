// deno-lint-ignore-file

import * as core from "../pkg/redis.ts";
import { Requester, UpstashRequest, UpstashResponse } from "../pkg/http.ts";
import { UpstashError } from "../pkg/error.ts";

// @ts-ignore Deno can't compile
import https from "https";
// @ts-ignore Deno can't compile
import http from "http";

export type { Requester, UpstashRequest, UpstashResponse };

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigVercel = {
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
   * const options: RedisConfigVercel = {
   *  agent: new https.Agent({ keepAlive: true })
   * }
   * ```
   */
  agent?: http.Agent | https.Agent;
};

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
  constructor(config: RedisConfigVercel);

  /**
   * Create a new redis client by providing a custom `Requester` implementation
   *
   * @example
   * ```ts
   *
   * import { UpstashRequest, Requester, UpstashResponse, Redis } from "@upstash/redis/vercel"
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
  constructor(configOrRequester: RedisConfigVercel | Requester) {
    if ("request" in configOrRequester) {
      super(configOrRequester);
      return;
    }

    const client = defaultRequester({
      baseUrl: configOrRequester.url,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
      agent: configOrRequester.agent,
    });

    super(client);
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
  static fromEnv(config?: Omit<RedisConfigVercel, "url" | "token">): Redis {
    // @ts-ignore process will be defined in node
    if (typeof process?.env === "undefined") {
      throw new Error(
        'Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead',
      );
    }
    // @ts-ignore process will be defined in node
    const url = process?.env["UPSTASH_REDIS_REST_URL"];
    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`",
      );
    }
    // @ts-ignore process will be defined in node
    const token = process?.env["UPSTASH_REDIS_REST_TOKEN"];
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`",
      );
    }
    return new Redis({ url, token, ...config });
  }
}

function defaultRequester(config: {
  headers?: Record<string, string>;
  baseUrl: string;
  agent?: http.Agent | https.Agent;
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
        // @ts-ignore
        agent: config.agent,
      });
      const body = (await res.json()) as UpstashResponse<TResult>;
      if (!res.ok) {
        throw new UpstashError(body.error!);
      }

      return body;
    },
  };
}
