import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hincrbyfloat
 * @see node_modules/@upstash/redis/docs/commands/hash/hincrbyfloat.mdx
 */
export class HIncrByFloatCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, field: string, increment: number],
    opts?: CommandOptions<number, number>
  ) {
    super(["hincrbyfloat", ...cmd], opts);
  }
}
