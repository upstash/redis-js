import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/del
 * @see node_modules/@upstash/redis/docs/commands/generic/del.mdx
 */
export class DelCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["del", ...cmd], opts);
  }
}
