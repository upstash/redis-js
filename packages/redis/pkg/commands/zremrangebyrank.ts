import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zremrangebyrank
 * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyrank.mdx
 */
export class ZRemRangeByRankCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, start: number, stop: number],
    opts?: CommandOptions<number, number>
  ) {
    super(["zremrangebyrank", ...cmd], opts);
  }
}
