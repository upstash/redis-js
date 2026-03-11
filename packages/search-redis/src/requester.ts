import type { Requester, UpstashRequest, UpstashResponse } from "@upstash/redis";

/**
 * NodeRedisRequester wraps node-redis and implements the Requester interface
 * This allows using node-redis with the Redis class from @upstash/redis
 */
export class NodeRedisRequester implements Requester {
    private client: any;

    constructor(client: any) {
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
            const result = await this.client.sendCommand([cmd, ...args]);

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
