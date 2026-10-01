import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/zcard
 * @see node_modules/@upstash/redis/docs/commands/zset/zcard.mdx
 */
export class ZCardCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["zcard", ...cmd], opts);
  }
}
