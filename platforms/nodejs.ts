// deno-lint-ignore-file

import * as core from "../pkg/redis";
import { Requester, UpstashRequest, UpstashResponse } from "../pkg/http";
import { UpstashError } from "../pkg/error";

// import https from "https";
// import http from "http";
import "isomorphic-fetch";

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

    const client = defaultRequester({
      baseUrl: configOrRequester.url,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
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
  static fromEnv(): Redis {
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
    return new Redis({ url, token });
  }
}

function defaultRequester(config: {
  headers?: Record<string, string>;
  baseUrl: string;
}): Requester {
  // let agent: http.Agent | https.Agent | undefined = undefined;

  // if (
  //   typeof window === "undefined" &&
  //   // @ts-ignore process will be defined in node
  //   typeof process !== "undefined" &&
  //   // @ts-ignore process will be defined in node
  //   process.release?.name === "node"
  // ) {
  //   const protocol = new URL(config.baseUrl).protocol;
  //   switch (protocol) {
  //     case "https:":
  //       agent = new https.Agent({ keepAlive: true });

  //       break;
  //     case "http:":
  //       agent = new http.Agent({ keepAlive: true });
  //       break;
  //   }
  // }

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
        // agent,
      });
      const body = (await res.json()) as UpstashResponse<TResult>;
      if (!res.ok) {
        throw new UpstashError(body.error!);
      }

      return body;
    },
  };
}
