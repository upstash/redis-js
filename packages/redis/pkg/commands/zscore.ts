import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/zscore
 * @see node_modules/@upstash/redis/docs/commands/zset/zscore.mdx
 */
export class ZScoreCommand<TData> extends Command<string | null, number | null> {
  constructor(
    cmd: [key: string, member: TData],
    opts?: CommandOptions<string | null, number | null>
  ) {
    super(["zscore", ...cmd], opts);
  }
}
