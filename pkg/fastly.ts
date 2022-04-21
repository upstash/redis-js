import { HttpClient } from "./http";
import * as core from "./redis";

/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfigFastly = {
	/**
   * UPSTASH_REDIS_REST_URL
   */
	url: string,
	/**
   * UPSTASH_REDIS_REST_TOKEN
   */
	token: string,
	/**
   * A Request can be forwarded to any backend defined on your service. Backends
   * can be created via the Fastly CLI, API, or web interface, and are
   * referenced by name.
   */
	backend: string,
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
   *    const redis = new Redis({
   *        url: "<UPSTASH_REDIS_REST_URL>",
   *        token: "<UPSTASH_REDIS_REST_TOKEN>",
   *        backend: "upstash-db",
   *    });
   * ```
   */
	constructor(config: RedisConfigFastly) {
		const client = new HttpClient({
			baseUrl: config.url,
			headers: { authorization: `Bearer ${config.token}` },
			options: { backend: config.backend },
		});

		super(client);
	}
}
