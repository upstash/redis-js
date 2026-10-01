import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/publish
 * @see node_modules/@upstash/redis/docs/commands/pubsub/publish.mdx
 */
export class PublishCommand<TMessage = unknown> extends Command<number, number> {
  constructor(cmd: [channel: string, message: TMessage], opts?: CommandOptions<number, number>) {
    super(["publish", ...cmd], opts);
  }
}
