import { HttpClient } from "./http";
import * as core from "./redis";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigCloudflare = {
	/**
   * UPSTASH_REDIS_REST_URL
   */
	url: string,
	/**
   * UPSTASH_REDIS_REST_TOKEN
   */
	token: string,
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
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
	constructor(config: RedisConfigCloudflare) {
		const client = new HttpClient({
			baseUrl: config.url,
			headers: { authorization: `Bearer ${config.token}` },
		});

		super(client);
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
	static fromEnv(
		env?: { UPSTASH_REDIS_REST_URL: string, UPSTASH_REDIS_REST_TOKEN: string },
	): Redis {
		/**
     * These should be injected by cloudflare.
     */

		// @ts-ignore
		// eslint-disable-next-line no-undef
		const url = env?.UPSTASH_REDIS_REST_URL ?? UPSTASH_REDIS_REST_URL;

		// @ts-ignore
		// eslint-disable-next-line no-undef
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
