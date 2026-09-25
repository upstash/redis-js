import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/exists
 * @see node_modules/@upstash/redis/docs/commands/generic/exists.mdx
 */
export class ExistsCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["exists", ...cmd], opts);
  }
}
