import type { Requester, UpstashRequest, UpstashResponse } from "@upstash/redis";
import type Redis from "ioredis";

/**
 * IoRedisRequester wraps ioredis and implements the Requester interface
 * This allows using ioredis with the Redis class from @upstash/redis
 */
export class IoRedisRequester implements Requester {
    private client: Redis;

    constructor(client: Redis) {
        this.client = client;
    }

    public async request<TResult>(req: UpstashRequest): Promise<UpstashResponse<TResult>> {
        const command = req.body as string[];

        if (!command || !Array.isArray(command) || command.length === 0) {
            return {
                error: "Invalid command: body must be a non-empty array",
            };
        }

        try {
            const [cmd, ...args] = command;
            const result = await this.client.call(cmd, ...args);

            return {
                result: result as TResult,
            };
        } catch (error) {
            return {
                error: (error as Error).message || "Unknown error occurred",
            };
        }
    }

    public getClient(): any {
        return this.client;
    }

    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.quit();
        }
    }
}
