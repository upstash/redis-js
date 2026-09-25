import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hincrby
 * @see node_modules/@upstash/redis/docs/commands/hash/hincrby.mdx
 */
export class HIncrByCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, field: string, increment: number],
    opts?: CommandOptions<number, number>
  ) {
    super(["hincrby", ...cmd], opts);
  }
}
