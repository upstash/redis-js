import * as core from "./redis";
import { HttpClient } from "./http";
import https from "https";
import http from "http";
import "isomorphic-fetch";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigNodejs = {
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
	constructor(config: RedisConfigNodejs) {
		/**
     * The use of an agent is only required in nodejs and depends on the protocol used.
     */
		let agent: http.Agent | https.Agent | undefined = undefined;
		if (typeof window === "undefined") {
			agent =
				new URL(config.url).protocol === "https:" ? new https.Agent({
					keepAlive: true,
				}) : new http.Agent({ keepAlive: true });
		}
		const client = new HttpClient({
			baseUrl: config.url,
			headers: { authorization: `Bearer ${config.token}` },
			options: { agent },
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
		if (typeof process?.env === "undefined") {
			throw new Error(
				"Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please use `Redis.onCloudflare()` instead",
			);
		}
		const url = process.env["UPSTASH_REDIS_REST_URL"];
		if (!url) {
			throw new Error(
				"Unable to find environment variable: `UPSTASH_REDIS_REST_URL`",
			);
		}
		const token = process.env["UPSTASH_REDIS_REST_TOKEN"];
		if (!token) {
			throw new Error(
				"Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`",
			);
		}
		return new Redis({ url, token });
	}
}
