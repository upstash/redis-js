import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/dbsize
 * @see node_modules/@upstash/redis/docs/commands/server/dbsize.mdx
 */
export class DBSizeCommand extends Command<number, number> {
  constructor(opts?: CommandOptions<number, number>) {
    super(["dbsize"], opts);
  }
}
