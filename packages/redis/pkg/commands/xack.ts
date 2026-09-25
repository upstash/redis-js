import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/xack
 * @see node_modules/@upstash/redis/docs/commands/stream/xack.mdx
 */
export class XAckCommand extends Command<number, number> {
  constructor(
    [key, group, id]: [key: string, group: string, id: string | string[]],
    opts?: CommandOptions<number, number>
  ) {
    const ids = Array.isArray(id) ? [...id] : [id];
    super(["XACK", key, group, ...ids], opts);
  }
}
